import { useEvents } from "@habla/nostr/hooks";
import Highlight from "@habla/components/nostr/Highlight";
import { HIGHLIGHT } from "@habla/const";

export default function NewHighlights({ pubkey, since, ...props }) {
  const { events } = useEvents({
    authors: [pubkey],
    kinds: [HIGHLIGHT],
    since: since + 1,
  });
  return (
    <>
      {events.map((ev) => (
        <Highlight key={ev.id} event={ev} {...props} />
      ))}
    </>
  );
}
