import Event from "./Event";

export default function Events({ events }) {
  return (
    <>
      {events.map((event, idx) => (
        <Event key={event.id} event={event} />
      ))}
    </>
  );
}
