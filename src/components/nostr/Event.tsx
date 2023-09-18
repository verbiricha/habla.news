import { Text } from "@chakra-ui/react";
import {
  HIGHLIGHT,
  NOTE,
  BADGE,
  ZAPSTR_TRACK,
  JOB_RESULT,
  ZAP_GOAL,
} from "@habla/const";

import Blockquote from "@habla/components/Blockquote";

import Highlight from "@habla/components/nostr/feed/Highlight";
import Note from "@habla/components/nostr/Note";
import Badge from "@habla/components/nostr/Badge";
import ZapstrTrack from "@habla/components/nostr/ZapstrTrack";
import JobResult from "@habla/components/nostr/JobResult";
import Goal from "@habla/components/nostr/Goal";
import UnknownKind from "@habla/components/nostr/UnknownKind";

export default function Event(props) {
  const { event } = props;

  if (event.kind === HIGHLIGHT) {
    return <Highlight {...props} maxW="586px" />;
  }

  if (event.kind === NOTE) {
    return <Note {...props} />;
  }

  if (event.kind === JOB_RESULT) {
    return <JobResult {...props} />;
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

  return <UnknownKind event={event} {...props} />;
}
