import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@habla/cache/db";

export default function useSeenOn(event: NDKEvent) {
  const seenOn = useLiveQuery(
    () => {
      const id = event?.tagId();
      if (id) {
        return db.relaySet.get(id).then((s) => s?.urls || []);
      }
      return [];
    },
    [event],
    []
  );
  return seenOn;
}
