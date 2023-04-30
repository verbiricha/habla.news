import Note from "@habla/components/nostr/Note";

export default function Comments({ event, comments }) {
  return (
    <>
      {comments.map((event, idx) => (
        <Note key={event.id} event={event} />
      ))}
    </>
  );
}
