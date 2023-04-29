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
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
          />
        </Prose>
        {!isDraft && <SeenIn relays={relays} />}
        {!isDraft && (
          <Flex alignItems="center" gap="6" mt={10}>
            <Highlights event={event} highlights={highlights} />
            <Comments event={event} comments={notes} />
            <Reactions event={event} reactions={reactions} />
            <Zaps event={event} zaps={zaps} />
          </Flex>
        )}
      </Box>
    </>
  );
}
