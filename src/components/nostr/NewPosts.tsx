import { useEvents } from "@habla/nostr/hooks";
import LongFormNote from "@habla/components/nostr/feed/LongFormNote";
import { LONG_FORM } from "@habla/const";

export default function NewPosts({ pubkey, since, ...props }) {
  const { events } = useEvents({
    authors: [pubkey],
    kinds: [LONG_FORM],
    since: since + 1,
  });
  return (
    <>
      {events.map((ev) => (
        <LongFormNote key={ev.id} event={ev} {...props} />
      ))}
    </>
  );
}
