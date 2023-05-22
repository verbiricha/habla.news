import { LONG_FORM, HIGHLIGHT, NOTE, BADGE } from "@habla/const";

import Highlight from "./nostr/feed/Highlight";
import Note from "./nostr/Note";
import Badge from "./nostr/Badge";
import LongFormNote from "./nostr/feed/LongFormNote";

export default function Event({ event }) {
  if (event.kind === LONG_FORM) {
    return <LongFormNote event={event} />;
  }

  if (event.kind === HIGHLIGHT) {
    return <Highlight event={event} />;
  }

  if (event.kind === NOTE) {
    return <Note event={event} />;
  }

  if (event.kind === BADGE) {
    return <Badge event={event} />;
  }

  return event.kind;
}
