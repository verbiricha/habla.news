import { Text } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";
import Markdown from "@habla/markdown/Markdown";
import Blockquote from "@habla/components/Blockquote";
import ExternalLink from "@habla/components/ExternalLink";

const JobType = "speech-to-text" | "summarization" | "translation";

function SpeechToText({ request, result, highlights }) {
  const file = findTag(request, "i");
  return (
    <>
      <Blockquote>
        <Markdown
          tags={request.tags}
          highlights={highlights}
          content={result.content}
        />
      </Blockquote>
      <ExternalLink
        href={file}
        color="secondary"
        fontFamily="'Inter'"
        fontWeight={600}
        fontSize="sm"
      >
        {file}
      </ExternalLink>
    </>
  );
}

export default function JobResult({ event, ...rest }) {
  const req = findTag(event, "e");
  const ev = useEvent({
    ids: [req],
  });
  const jobType = ev && findTag(ev, "j");

  if (jobType === "speech-to-text") {
    return <SpeechToText request={ev} result={event} {...rest} />;
  }

  return null;
}
