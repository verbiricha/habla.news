import { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";
import db from "@habla/cache/db";

import { findTag } from "../tags";

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

      if (kinds.length > 0 && authors.length > 0 && identifiers.length > 0) {
        query = db.event
          .where("[kind+pubkey+d]")
          .anyOf(combineLists([kinds, authors, identifiers]));
      } else if (kinds.length > 0 && authors.length > 0) {
        query = db.event
          .where("[kind+pubkey]")
          .anyOf(combineLists([kinds, authors]));
      } else if (kinds.length > 0 && addresses.length > 0) {
        query = db.event
          .where("[kind+a]")
          .anyOf(combineLists([kinds, addresses]));
      } else if (kinds.length > 0 && pubkeys.length > 0) {
        query = db.event
          .where("[kind+p]")
          .anyOf(combineLists([kinds, pubkeys]));
      } else if (kinds.length > 0 && identifiers.length > 0) {
        query = db.event
          .where("[kind+d]")
          .anyOf(combineLists([kinds, identifiers]));
      } else if (kinds.length > 0 && events.length > 0) {
        query = db.event.where("[kind+e]").anyOf(combineLists([kinds, events]));
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
      // todo: limit
      if (query && filter["#d"]) {
        query = query.and((ev) => filter["#d"].includes(ev.d));
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

      for (const ev of result) {
        const ndkEv = new NDKEvent(sub.ndk, ev);
        sub.eventReceived(ndkEv, undefined, true);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async setEvent(event: NDKEvent, filter: NDKFilter) {
    try {
      const d = findTag(event, "d");
      const a = findTag(event, "a");
      const e = findTag(event, "e");
      const p = findTag(event, "p");
      // todo: remove old entries for replaceable events
      return db.event.put({ ...event.rawEvent(), d, a, e, p });
    } catch (error) {
      console.error(error);
    }
  },
};
