import Highlight from "@habla/components/nostr/feed/Highlight";

export default function Highlights({ event, highlights }) {
  return (
    <>
      {highlights.map((event, idx) => (
        <Highlight key={event.id} event={event} showHeader={false} />
      ))}
    </>
  );
}
