import { Text } from "@chakra-ui/react";
import {
  HIGHLIGHT,
  NOTE,
  ZAP_GOAL,
  LONG_FORM,
  LONG_FORM_DRAFT,
  FILE,
} from "@habla/const";

import Blockquote from "@habla/components/Blockquote";

import LongFormNote from "@habla/components/nostr/feed/LongFormNote";
import Highlight from "@habla/components/nostr/Highlight";
import Note from "@habla/components/nostr/Note";
import Goal from "@habla/components/nostr/Goal";
import File from "@habla/components/nostr/File";
import UnknownKind from "@habla/components/nostr/UnknownKind";

export default function Event(props) {
  const { event } = props;

  if (event.kind === HIGHLIGHT) {
    return <Highlight {...props} />;
  }

  if (event.kind === NOTE) {
    return <Note {...props} />;
  }

  if (event.kind === LONG_FORM || event.kind === LONG_FORM_DRAFT) {
    return <LongFormNote {...props} />;
  }

  if (event.kind === ZAP_GOAL) {
    return <Goal {...props} />;
  }

  if (event.kind === FILE) {
    return <File {...props} />;
  }

  return <UnknownKind event={event} {...props} />;
}
