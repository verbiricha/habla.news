import { HIGHLIGHT, NOTE, BADGE } from "@habla/const";

import Highlight from "../Highlight";
import Note from "./Note";
import Badge from "./Badge";

export default function Event({ event }) {
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
