import { Text } from "@chakra-ui/react";
import { HIGHLIGHT, NOTE, BADGE, ZAPSTR_TRACK, JOB_RESULT } from "@habla/const";

import Blockquote from "@habla/components/Blockquote";

import Highlight from "./feed/Highlight";
import Note from "./Note";
import Badge from "./Badge";
import ZapstrTrack from "./ZapstrTrack";
import JobResult from "./JobResult";
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

  return <UnknownKind event={event} {...props} />;
}
