import { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";
import db from "@habla/cache/db";

import { LONG_FORM } from "@habla/const";
import { findTag, findTags } from "@habla/tags";

function combineLists(lists) {
  const result = [];

  function recursiveHelper(currIndex, tempList) {
    if (currIndex === lists.length) {
      result.push(tempList.slice());
      return;
    }

    for (let i = 0; i < lists[currIndex].length; i++) {
      tempList.push(lists[currIndex][i]);
      recursiveHelper(currIndex + 1, tempList);
      tempList.pop();
    }
  }

  recursiveHelper(0, []);

  return result;
}

export default {
  locking: true,
  async query(sub: NDKSubscription) {
    const { filter } = sub;
    const { ids = [], authors = [], kinds = [], since, until, limit } = filter;
    const addresses = filter["#a"] ?? [];
    const identifiers = filter["#d"] ?? [];
    const events = filter["#e"] ?? [];
    const pubkeys = filter["#p"] ?? [];

    try {
      let result = [];
      let query;
      let debug;

      if (kinds.length > 0 && authors.length > 0 && identifiers.length > 0) {
        const filter = combineLists([kinds, authors, identifiers]);
        debug = ["Query[kind+pubkey+d]", filter];
        query = db.event.where("[kind+pubkey+d]").anyOf(filter);
      } else if (kinds.length > 0 && authors.length > 0) {
        const filter = combineLists([kinds, authors]);
        //console.debug("Query[kind+pubkey]", filter);
        query = db.event.where("[kind+pubkey]").anyOf(filter);
      } else if (kinds.length > 0 && addresses.length > 0) {
        const filter = combineLists([kinds, addresses]);
        //console.debug("Query[kind+a]", filter);
        query = db.event.where("[kind+a]").anyOf(filter);
      } else if (kinds.length > 0 && pubkeys.length > 0) {
        const filter = combineLists([kinds, pubkeys]);
        //console.debug("Query[kind+p]", filter);
        query = db.event.where("[kind+p]").anyOf(filter);
      } else if (kinds.length > 0 && identifiers.length > 0) {
        const filter = combineLists([kinds, identifiers]);
        //console.debug("Query[kind+d]", filter);
        query = db.event.where("[kind+d]").anyOf(filter);
      } else if (kinds.length > 0 && events.length > 0) {
        const filter = combineLists([kinds, events]);
        //console.debug("Query[kind+e]", filter);
        query = db.event.where("[kind+e]").anyOf(filter);
      } else if (kinds.length > 0) {
        //console.debug("Query[kind]", kinds);
        query = db.event.where("kind").anyOf(kinds);
      } else if (ids.length > 0) {
        //console.debug("Query[id]", ids);
        query = db.event.where("id").anyOf(ids);
      } else if (authors.length > 0) {
        //console.debug("Query[pubkey]", authors);
        query = db.event.where("pubkey").anyOf(authors);
      }

      if (query && since) {
        query = query.and((ev) => ev.created_at > since);
      }
      if (query && until) {
        query = query.and((ev) => ev.created_at < until);
      }
      // todo: limit

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

      if (query) {
        result = await query.toArray();
      }

      if (debug) {
        console.debug("Query", debug, result);
      }

      for (const ev of result) {
        const ndkEv = new NDKEvent(sub.ndk, ev);
        sub.eventReceived(ndkEv, undefined, true);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async setEvent(event: NDKEvent, filter: NDKFilter) {
    // todo: replaceable? replace if created_at > stored created_at
    try {
      if (event.kind === 0) {
        await db.profile.put({
          id: event.pubkey,
          ...JSON.parse(event.content),
        });
      }
      const d = findTag(event, "d");
      const a = findTag(event, "a");
      const e = findTag(event, "e");
      const p = findTag(event, "p");
      const t = findTags(event, "t");
      return db.event.put({
        ...event.rawEvent(),
        id: event.tagId(),
        d,
        a,
        e,
        p,
        t,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
