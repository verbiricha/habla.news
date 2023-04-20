import { useMemo } from "react";

import { Flex, Box, Heading, Text } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "./nostr/User";

import useSeenOn from "@habla/hooks/useSeenOn";
import SeenIn from "@habla/components/SeenIn";
import { getMetadata } from "@habla/nip23";
import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";
import Markdown from "@habla/markdown/Markdown";
import Zaps from "./Zaps";
import Highlights from "./Highlights";
import Reactions from "./Reactions";

export default function LongFormNote({
  event,
  zaps = [],
  highlights = [],
  reactions = [],
}) {
  const { title, summary, image, hashtags, publishedAt } = useMemo(
    () => getMetadata(event),
    [event]
  );
  const relays = useSeenOn(event);
  return (
    <>
      <User pubkey={event.pubkey} />
      <Box as="article">
        <Prose>
          <Heading as="h1">{title}</Heading>
          {summary?.length > 0 && <blockquote>{summary}</blockquote>}
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
          />
        </Prose>
        <Flex alignItems="center" gap="6" mt={10}>
          <Zaps event={event} zaps={zaps} />
          <Highlights event={event} highlights={highlights} />
          <Reactions event={event} reactions={reactions} />
          <Box ml="auto">
            <SeenIn relays={relays} />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
