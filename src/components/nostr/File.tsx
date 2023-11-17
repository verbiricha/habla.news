import { useMemo } from "react";
import { nip19 } from "nostr-tools";

import { Flex, Box, AspectRatio, Image, Text } from "@chakra-ui/react";

import { findTag, findTags } from "@habla/tags";

function Video({ alt, url }) {
  return (
    <Flex direction="column" w="100%" align="center">
      <video alt={alt} key={url} controls src={url} />

      {alt.length > 0 && (
        <Box ml={2}>
          <Text
            as="span"
            color="secondary"
            fontSize="xs"
            fontFamily="sans-serif"
          >
            {alt}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

function Audio({ alt, url }) {
  return (
    <Flex direction="column" w="100%" align="center">
      <audio key={url} controls src={url} />
      {alt.length > 0 && (
        <Box ml={2}>
          <Text
            as="span"
            color="secondary"
            fontSize="xs"
            fontFamily="sans-serif"
          >
            {alt}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

function Img({ pubkey, src, alt }) {
  return (
    <Flex direction="column" w="100%" align="center">
      <Image objectFit="cover" src={src} alt={alt} />
      {alt.length > 0 && (
        <Box ml={2}>
          <Text
            as="span"
            color="secondary"
            fontSize="xs"
            fontFamily="sans-serif"
          >
            {alt}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default function File({ event }) {
  const url = useMemo(
    () => findTag(event, "url") || findTag(event, "u"),
    [event]
  );
  const magnet = useMemo(() => findTag(event, "magnet"), [event]);
  const mime = useMemo(
    () => findTag(event, "m") || findTag(event, "type"),
    [event]
  );
  const isImage = useMemo(() => mime?.startsWith("image"), [mime]);

  return (
    <>
      {mime.startsWith("video") && <Video url={url} alt={event.content} />}
      {mime.startsWith("audio") && <Audio url={url} alt={event.content} />}
      {isImage && <Img pubkey={event.pubkey} src={url} alt={event.content} />}
    </>
  );
}
