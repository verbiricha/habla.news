import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@habla/cache/db";

export default function useSeenOn(event: NDKEvent) {
  const seenOn = useLiveQuery(
    () => {
      if (event?.tagId) {
        const id = event?.tagId();
        return db.relaySet.get(id).then((s) => s?.urls || []);
      }
      return [];
    },
    [event],
    []
  );
  return seenOn;
}
