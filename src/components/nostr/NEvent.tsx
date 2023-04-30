import { useEvent } from "@habla/nostr/hooks";
import Event from "@habla/components/Event";

export default function NEvent({ id, author, relays, nevent }) {
  const event = useEvent(
    {
      ids: [id],
      authors: [author],
    },
    { relays }
  );
  return event ? <Event event={event} /> : null;
}
