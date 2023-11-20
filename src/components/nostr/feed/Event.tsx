import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  HIGHLIGHT,
  LISTS,
  COMMUNITY,
  NOTE,
} from "@habla/const";

import LongFormNote from "./LongFormNote";
import Highlight from "@habla/components/nostr/Highlight";
import Note from "@habla/components/nostr/Note";
import Community from "./Community";
import List from "@habla/components/nostr/List";

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

  if (event.kind === COMMUNITY) {
    return <Community event={event} />;
  }

  if (event.kind === NOTE) {
    return <Note event={event} />;
  }

  return null;
}
