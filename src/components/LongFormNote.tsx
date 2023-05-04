import { useMemo } from "react";

import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "./nostr/User";

import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import SeenIn from "@habla/components/SeenIn";
import Markdown from "@habla/markdown/Markdown";
import Zaps from "./Zaps";
import Highlights from "@habla/components/reactions/Highlights";
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
            <SeenIn event={event} />
          </Flex>
        )}
      </Box>
    </>
  );
}
