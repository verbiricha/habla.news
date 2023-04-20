import Note from "./Note";
import LongFormNote from "./feed/LongFormNote";

export function Event({ event }) {
  if (event.kind === 30023) {
    return <LongFormNote event={event} />;
  }

  if (event.kind === 1) {
    return <Note event={event} />;
  }

  return event.kind;
}
