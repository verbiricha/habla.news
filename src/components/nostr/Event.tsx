import { HIGHLIGHT, NOTE, BADGE, ZAPSTR_TRACK } from "@habla/const";

import Highlight from "../Highlight";
import Note from "./Note";
import Badge from "./Badge";
import ZapstrTrack from "./ZapstrTrack";

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

  if (event.kind === ZAPSTR_TRACK) {
    return <ZapstrTrack event={event} />;
  }

  return event.kind;
}
