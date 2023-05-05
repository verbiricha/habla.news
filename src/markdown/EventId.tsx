import { useEvent } from "../nostr/hooks";

import Event from "../components/nostr/Event";

export default function EventId({ id }) {
  const event = useEvent({ ids: [id] });
  return event ? <Event event={event} /> : null;
}
