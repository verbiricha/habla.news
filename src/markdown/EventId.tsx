import { useEvent } from "../nostr/hooks";

import Note from "../components/nostr/Note";

export default function EventId({ id }) {
  const event = useEvent({ ids: [id] });
  return event ? <Note event={event} /> : null;
}
