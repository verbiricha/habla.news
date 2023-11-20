import Highlight from "@habla/components/nostr/Highlight";

export default function Highlights({ highlights, ...rest }) {
  return (
    <>
      {highlights.map((event) => (
        <Highlight key={event.id} event={event} {...rest} />
      ))}
    </>
  );
}
