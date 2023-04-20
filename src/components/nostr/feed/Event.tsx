import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  HIGHLIGHT,
  NOTE,
  REACTION,
  ZAP,
} from "@habla/const";

import Note from "./Note";
import LongFormNote from "./LongFormNote";
import Highlight from "./Highlight";
import Reaction from "./Reaction";

export default function Event({ event }) {
  if (event.kind === NOTE) {
    return <Note event={event} />;
  }
  if (event.kind === LONG_FORM || event.kind === LONG_FORM_DRAFT) {
    return <LongFormNote event={event} />;
  }

  if (event.kind === HIGHLIGHT) {
    return <Highlight event={event} />;
  }

  if (event.kind === REACTION) {
    return <Reaction event={event} />;
  }

  return null;
}
