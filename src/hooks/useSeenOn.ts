import { useLiveQuery } from "dexie-react-hooks";
import db from "@habla/cache/db";

export default function useSeenOn(event) {
  const seenOn = useLiveQuery(() => db.relaySet.get(event.id), [event.id]);
  return seenOn ? seenOn.urls : [];
}
