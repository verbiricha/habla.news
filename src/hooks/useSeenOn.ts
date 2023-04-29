import { useLiveQuery } from "dexie-react-hooks";
import db from "@habla/cache/db";

export default function useSeenOn(event) {
  const seenOn = useLiveQuery(() => {
    if (event?.id) {
      return db.relaySet.get(event.id);
    }
  }, [event]);
  return seenOn ? seenOn.urls : [];
}
