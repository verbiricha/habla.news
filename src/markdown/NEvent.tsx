import { useEvent } from "../nostr/hooks";

import Note from "../components/nostr/Note";

export default function NEvent({ nevent, id, relays }) {
  const event = useEvent({ ids: [id] }, { relays });
  return event ? <Note event={event} /> : null;
}
