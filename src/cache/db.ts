import { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";
import Dexie, { type Table } from "dexie";
import { combineLists } from "@habla/util";
import { findTag, findTags } from "@habla/tags";
import { PROFILE } from "@habla/const";

interface Event {
  id: string;
  created_at: number;
  kind: number;
  pubkey: string;
  tags: string[][];
  content: string;
  sig: string;
}

interface Profile {
  id: string;
  name?: string;
  about?: string;
  picture?: string;
  banner?: string;
  nip05?: string;
  lud16?: string;
  emoji: string[];
}

interface RelayMetadata {
  id: string;
  name: string;
  description?: string;
  pubkey?: string;
  contact?: string;
  supported_nips: string[];
  software?: string;
  version?: string;
}

export class HablaDatabase extends Dexie {
  event!: Table<Event>;
  profile!: Table<Profile>;
  relayMetadata!: Table<RelayMetadata>;

  constructor() {
    super("habla.news");
    this.version(2).stores({
      event:
        "id,created_at,kind,pubkey,[kind+pubkey],[kind+pubkey+d],[kind+a],[kind+e],[kind+p],t",
      profile:
        "id,name,display_name,about,picture,nip05,lud16,banner,emoji,created_at",
      relayMetadata:
        "id,name,description,pubkey,contact,supported_nips,software,version",
    });
  }
}

export function filterEvents(db: HablaDatabase, filter: NDKFilter) {
  const { ids = [], authors = [], kinds = [], since, until, limit } = filter;
  const addresses = filter["#a"] ?? [];
  const identifiers = filter["#d"] ?? [];
  const events = filter["#e"] ?? [];
  const pubkeys = filter["#p"] ?? [];

  let result = [];
  let query;

  if (kinds.length > 0 && authors.length > 0 && identifiers.length > 0) {
    const filter = combineLists([kinds, authors, identifiers]);
    query = db.event.where("[kind+pubkey+d]").anyOf(filter);
  } else if (kinds.length > 0 && authors.length > 0) {
    const filter = combineLists([kinds, authors]);
    query = db.event.where("[kind+pubkey]").anyOf(filter);
  } else if (kinds.length > 0 && addresses.length > 0) {
    const filter = combineLists([kinds, addresses]);
    query = db.event.where("[kind+a]").anyOf(filter);
  } else if (kinds.length > 0 && pubkeys.length > 0) {
    const filter = combineLists([kinds, pubkeys]);
    query = db.event.where("[kind+p]").anyOf(filter);
  } else if (kinds.length > 0 && identifiers.length > 0) {
    const filter = combineLists([kinds, identifiers]);
    query = db.event.where("[kind+d]").anyOf(filter);
  } else if (kinds.length > 0 && events.length > 0) {
    const filter = combineLists([kinds, events]);
    query = db.event.where("[kind+e]").anyOf(filter);
  } else if (kinds.length > 0) {
    query = db.event.where("kind").anyOf(kinds);
  } else if (ids.length > 0) {
    query = db.event.where("id").anyOf(ids);
  } else if (authors.length > 0) {
    query = db.event.where("pubkey").anyOf(authors);
  }

  if (query && since) {
    query = query.and((ev) => ev.created_at > since);
  }
  if (query && until) {
    query = query.and((ev) => ev.created_at < until);
  }

  if (query && filter["#d"]) {
    query = query.and((ev) => filter["#d"].includes(ev.d));
  }
  if (query && filter["#t"]) {
    query = query.and((ev) => filter["#t"].some((t) => ev.t.includes(t)));
  }
  if (query && filter["#a"]) {
    query = query.and((ev) => filter["#a"].includes(ev.a));
  }
  if (query && filter["#e"]) {
    query = query.and((ev) => filter["#e"].includes(ev.e));
  }
  if (query && filter["#p"]) {
    query = query.and((ev) => filter["#p"].includes(ev.p));
  }

  if (query && filter["search"]) {
    const search = filter["search"];
    query = query.and((ev) => {
      const title = ev.tags.find((t) => t.at(0) === "title");
      const summary = ev.tags.find((t) => t.at(0) === "summary");
      const content = ev.content;
      return (
        content.includes(search) ||
        summary?.includes(search) ||
        title?.includes(search)
      );
    });

    if (query && limit) {
      query = query.and((ev) => ev.created_at < until);
    }
  }

  return query;
}

export async function storeEvent(db: HablaDatabase, event: NDKEvent) {
  return db
    .transaction("rw", db.profile, db.event, async () => {
      if (event.kind === PROFILE) {
        const existing = await db.profile.get(event.pubkey);
        if (!existing || event.created_at > existing.created_at) {
          await db.profile.put({
            id: event.pubkey,
            created_at: event.created_at,
            ...JSON.parse(event.content),
            emoji: event.tags.filter((t) => t.at(0) === "emoji"),
          });
        }
      }
      const id = event.tagId();
      if (event.isParamReplaceable() || event.isReplaceable()) {
        const existing = await db.event.get(id);
        if (existing && existing.created_at >= event.created_at) {
          return;
        }
      }

      const d = findTag(event, "d");
      const a = findTag(event, "a");
      const e = findTag(event, "e");
      const p = findTag(event, "p");
      const t = findTags(event, "t");
      return db.event.put({
        ...event.rawEvent(),
        id,
        d,
        a,
        e,
        p,
        t,
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

export default new HablaDatabase();
