import { Text } from "@chakra-ui/react";
import {
  HIGHLIGHT,
  NOTE,
  BADGE,
  ZAPSTR_TRACK,
  JOB_RESULT,
  ZAP_GOAL,
  LONG_FORM,
  FILE,
} from "@habla/const";

import Blockquote from "@habla/components/Blockquote";

import LongFormNote from "@habla/components/nostr/feed/LongFormNote";
import Highlight from "@habla/components/nostr/feed/Highlight";
import Note from "@habla/components/nostr/Note";
import Badge from "@habla/components/nostr/Badge";
import ZapstrTrack from "@habla/components/nostr/ZapstrTrack";
import JobResult from "@habla/components/nostr/JobResult";
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

  if (event.kind === JOB_RESULT) {
    return <JobResult {...props} />;
  }

  if (event.kind === LONG_FORM) {
    return <LongFormNote {...props} />;
  }

  if (event.kind === BADGE) {
    return <Badge {...props} />;
  }

  if (event.kind === ZAPSTR_TRACK) {
    return <ZapstrTrack {...props} />;
  }

  if (event.kind === ZAP_GOAL) {
    return <Goal {...props} />;
  }

  if (event.kind === FILE) {
    return <File {...props} />;
  }

  return <UnknownKind event={event} {...props} />;
}
