import { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";

import { PROFILE, LONG_FORM } from "./const";

const LONG_FORM_SUB = "30023-#d-authors-kinds";
const PROFILE_SUB = "0-authors-kinds";

export default {
  locking: false,
  async query(sub: NDKSubscription) {
    const subId = sub.groupableId();

    if (subId === PROFILE_SUB) {
      for (const author of sub.filter.authors) {
        const raw = window.localStorage.getItem(`profile:${author}`);
        if (raw) {
          const ev = JSON.parse(raw);
          const ndkEv = new NDKEvent(sub.ndk, event);
          sub.eventReceived(ndkEv, undefined, true);
        }
      }
    }

    if (subId === LONG_FORM_SUB) {
      // todo: store/emit all sub events
      const raw = window.localStorage.getItem(
        `event:${sub.filter.kinds.at(0)}:${sub.filter.authors.at(
          0
        )}:${sub.filter["#d"].at(0)}`
      );
      if (raw) {
        const ev = JSON.parse(raw);
        const ndkEv = new NDKEvent(sub.ndk, event);
        sub.eventReceived(ndkEv, undefined, true);
      }
    }
  },
  async setEvent(event: NDKEvent, filter: NDKFilter) {
    if (typeof window !== "undefined") {
      if (event.kind === PROFILE) {
        window.localStorage.setItem(
          `profile:${event.pubkey}`,
          JSON.stringify(event.rawEvent())
        );
      }
      if (event.kind === LONG_FORM) {
        const id = event.tagId();
        window.localStorage.setItem(
          `e:${id}`,
          JSON.stringify(event.rawEvent())
        );
      }
    }
  },
};
