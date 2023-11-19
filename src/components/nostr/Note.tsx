import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

import {
  Flex,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import Markdown from "@habla/markdown/Markdown";
import Reactions from "@habla/components/nostr/LazyReactions";
import User from "@habla/components/nostr/User";
import ExternalLinkIcon from "@habla/components/ExternalLinkIcon";
import { ZAP, NOTE, REACTION, BOOKMARKS } from "@habla/const";

export default function Note({ event, highlights = [], ...props }) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const nevent = useMemo(() => {
    return event.encode();
  }, [event]);
  return (
    <Card my={4} {...props} ref={ref}>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <User pubkey={event.pubkey} size="sm" />
          <ExternalLinkIcon href={`/e/${nevent}`} />
        </Flex>
      </CardHeader>
      <CardBody
        dir="auto"
        pt={0}
        wordBreak="break-word"
        sx={{ "> p": { fontSize: "md", my: 3 } }}
      >
        <Markdown
          content={event.content}
          tags={event.tags}
          highlights={highlights}
        />
      </CardBody>
      <CardFooter dir="auto">
        <Reactions
          event={event}
          kinds={[ZAP, NOTE, REACTION, BOOKMARKS]}
          live={inView}
        />
      </CardFooter>
    </Card>
  );
}
