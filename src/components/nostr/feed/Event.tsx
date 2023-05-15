import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  HIGHLIGHT,
  LISTS,
  ZAPSTR_TRACK,
} from "@habla/const";

import LongFormNote from "./LongFormNote";
import Highlight from "./Highlight";
import List from "@habla/components/nostr/List";
import ZapstrTrack from "@habla/components/nostr/ZapstrTrack";

export default function Event({ event }) {
  if (event.kind === LONG_FORM || event.kind === LONG_FORM_DRAFT) {
    return <LongFormNote event={event} />;
  }

  if (event.kind === HIGHLIGHT) {
    return <Highlight event={event} />;
  }

  if (LISTS.includes(event.kind)) {
    return <List event={event} />;
  }

  if (event.kind === ZAPSTR_TRACK) {
    return <ZapstrTrack event={event} />;
  }

  return null;
}
