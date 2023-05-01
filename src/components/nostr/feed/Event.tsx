import { LONG_FORM, LONG_FORM_DRAFT, HIGHLIGHT } from "@habla/const";

import LongFormNote from "./LongFormNote";
import Highlight from "./Highlight";

export default function Event({ event }) {
  if (event.kind === LONG_FORM || event.kind === LONG_FORM_DRAFT) {
    return <LongFormNote event={event} />;
  }

  if (event.kind === HIGHLIGHT) {
    return <Highlight event={event} />;
  }

  return null;
}
