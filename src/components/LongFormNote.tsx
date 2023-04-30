import { useMemo } from "react";

import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
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
import Comments from "./Comments";

export default function LongFormNote({
  event,
  excludeAuthor,
  isDraft,
  zaps = [],
  notes = [],
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
      {!excludeAuthor && <User pubkey={event.pubkey} />}
      <Box as="article">
        <Prose>
          <Heading as="h1">{title}</Heading>
          {summary?.length > 0 && <blockquote>{summary}</blockquote>}
          {image?.length > 0 && (
            <Image src={image} alt={title} width="100%" objectFit="contain" />
          )}

          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
          />
        </Prose>
        {!isDraft && (
          <Flex
            flexDirection={["column-reverse", "row"]}
            alignItems={["flex-start", "center"]}
            gap={4}
            justifyContent="space-between"
            mt={10}
          >
            <Flex alignItems="center" gap="6">
              <Highlights event={event} highlights={highlights} />
              <Comments event={event} comments={notes} />
              <Reactions event={event} reactions={reactions} />
              <Zaps event={event} zaps={zaps} />
            </Flex>
            <Flex alignItems="center" color="gray.500" gap={2}>
              <Text fontSize="sm">seen in</Text>
              <SeenIn relays={relays} />
            </Flex>
          </Flex>
        )}
      </Box>
    </>
  );
}
