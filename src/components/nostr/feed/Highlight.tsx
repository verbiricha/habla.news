import { useMemo } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

import {
  Flex,
  Box,
  Heading,
  Text,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";

import { ZAP, REPOST, NOTE } from "@habla/const";
import { useEvent } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Blockquote from "@habla/components/Blockquote";
import User from "@habla/components/nostr/User";
import Reactions from "@habla/components/nostr/LazyReactions";
import EventId from "@habla/markdown/EventId";
import ExternalLink from "@habla/components/ExternalLink";
import useModeration from "@habla/hooks/useModeration";
import useHashtags from "@habla/hooks/useHashtags";

const HighlightSubstring = ({ text, substring }) => {
  const startIndex = text.indexOf(substring);
  const endIndex = startIndex + substring.length;

  if (startIndex === -1) {
    // Substring not found in the text
    return <>{text}</>;
  }

  const beforeSubstring = text.slice(0, startIndex);
  const markedSubstring = text.slice(startIndex, endIndex);
  const afterSubstring = text.slice(endIndex);

  return (
    <>
      {beforeSubstring}
      <mark>{markedSubstring}</mark>
      {afterSubstring}
    </>
  );
};

export default function Highlight({
  event,
  showHeader = true,
  showReactions = false,
  ...props
}) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const a = findTag(event, "a");
  const e = findTag(event, "e");
  const r = findTag(event, "r");
  const context = findTag(event, "context");
  const [kind, pubkey, identifier] = a?.split(":") ?? [];
  const nevent = useMemo(() => {
    if (event.id) {
      return nip19.neventEncode({
        id: event.id,
        author: event.pubkey,
      });
    }
  }, [event]);
  const naddr = useMemo(() => {
    if (kind && pubkey && identifier) {
      return nip19.naddrEncode({
        identifier,
        pubkey,
        kind: Number(kind),
      });
    }
  }, [kind, pubkey, identifier]);

  const { colorMode } = useColorMode();
  const { mutedWords, isTagMuted } = useModeration();
  const hashtags = useHashtags(event);
  const isHidden = useMemo(() => {
    return (
      isTagMuted(["p", event.pubkey]) ||
      isTagMuted(event.tagReference()) ||
      hashtags.some((t) => isTagMuted(["t", t])) ||
      mutedWords.some((word) => {
        return event.content.toLowerCase().includes(word.toLowerCase());
      })
    );
  }, [mutedWords, isTagMuted]);

  return event.content.length < 4200 && !isHidden ? (
    <Card variant="highlight" key={event.id} ref={ref} my={4} {...props}>
      {showHeader && (
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            <User pubkey={event.pubkey} />
            <Link href={`/e/${nevent}`} shallow>
              <Icon
                as={LinkIcon}
                boxSize={3}
                color="secondary"
                cursor="pointer"
              />
            </Link>
          </Flex>
        </CardHeader>
      )}
      <CardBody dir="auto">
        <Stack gap="1">
          {!e && (
            <Box mb={2}>
              <Blockquote style={{ margin: 0 }}>
                {context && context.length > event.content.length + 1 ? (
                  <HighlightSubstring
                    text={context}
                    substring={event.content}
                  />
                ) : (
                  event.content
                )}
              </Blockquote>
            </Box>
          )}
          {e && <EventId id={e} my={0} highlights={[event]} />}
          {naddr && (
            <Flex gap={2} direction="column">
              <ArticleTitle
                naddr={naddr}
                kind={Number(kind)}
                identifier={identifier}
                pubkey={pubkey}
                fontFamily="'Inter'"
                fontWeight={600}
                fontSize="sm"
                color="secondary"
              />
              <User pubkey={pubkey} size="xs" fontSize="xs" />
            </Flex>
          )}
          {r && !naddr && !r.startsWith("https://habla.news") && (
            <ExternalLink href={r}>
              <Text
                fontFamily="'Inter'"
                fontWeight={600}
                fontSize="sm"
                color="secondary"
              >
                {r}
              </Text>
            </ExternalLink>
          )}
        </Stack>
      </CardBody>
      {showReactions && (
        <CardFooter dir="auto">
          <Reactions event={event} kinds={[ZAP, REPOST, NOTE]} live={inView} />
        </CardFooter>
      )}
    </Card>
  ) : null;
}
