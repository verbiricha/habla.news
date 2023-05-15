import { useMemo } from "react";
import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import User from "./nostr/User";

import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import SeenIn from "@habla/components/SeenIn";
import Markdown from "@habla/markdown/Markdown";
import Hashtags from "@habla/components/Hashtags";
import { formatDay } from "@habla/format";
import Zaps from "./Zaps";
import Highlights from "@habla/components/reactions/Highlights";
import Comments from "./Comments";

export default function LongFormNote({
  event,
  isDraft,
  zaps = [],
  notes = [],
  highlights = [],
}) {
  const { title, summary, image, hashtags, publishedAt } = useMemo(
    () => getMetadata(event),
    [event]
  );
  return (
    <>
      <Box sx={{ wordBreak: "break-word" }}>
        <Flex align="center" gap={3} fontFamily="Inter">
          {event.pubkey && <User pubkey={event.pubkey} />}
          <Text color="secondary" fontSize="xs">
            {formatDay(publishedAt)}
          </Text>
        </Flex>
        <Heading as="h1" my={2}>
          {title}
        </Heading>
        <Hashtags hashtags={hashtags} my={4} />
        <Prose>
          {image?.length > 0 && (
            <Image
              mb={2}
              src={image}
              alt={title}
              width="100%"
              maxHeight="520px"
            />
          )}
          {summary?.length > 0 && <p>{summary}</p>}
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
            <Flex alignItems="center" gap="3">
              <Zaps event={event} zaps={zaps} />
              <Highlights event={event} highlights={highlights} />
              <Comments event={event} comments={notes} />
            </Flex>
            <SeenIn event={event} />
          </Flex>
        )}
      </Box>
      <Box mt="120px">
        <Text color="secondary" textAlign="center">
          𐡷
        </Text>
      </Box>
    </>
  );
}
