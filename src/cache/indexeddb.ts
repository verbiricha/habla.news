import {
  NDKEvent,
  NDKFilter,
  NDKSubscription,
  NDKCacheAdapter,
} from "@nostr-dev-kit/ndk";
import db, {
  type HablaDatabase,
  storeEvent,
  filterEvents,
} from "@habla/cache/db";

import { LONG_FORM } from "@habla/const";

interface CacheOptions {
  db: HablaDatabase;
}

class IndexedDBCache implements NDKCacheAdapter {
  readonly locking;
  readonly db;

  constructor(opts: CacheOptions) {
    this.locking = true;
    this.db = opts.db;
  }

  async query(sub: NDKSubscription) {
    try {
      const { filter } = sub;
      const query = filterEvents(this.db, filter);

      let result = [];
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
  }

  async setEvent(event: NDKEvent, filter: NDKFilter) {
    try {
      return storeEvent(this.db, event);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new IndexedDBCache({ db });
