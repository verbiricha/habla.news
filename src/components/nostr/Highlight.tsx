import { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

import {
  Flex,
  HStack,
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

import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Blockquote from "@habla/components/Blockquote";
import ExternalLink from "@habla/components/ExternalLink";
import User from "@habla/components/nostr/User";
import Reactions from "@habla/components/nostr/LazyReactions";
import EventTitle from "@habla/components/nostr/EventTitle";
import { RecommendedAppMenu } from "@habla/components/nostr/UnknownKind";
import useModeration from "@habla/hooks/useModeration";
import useHashtags from "@habla/hooks/useHashtags";
import { ZAP, REPOST, NOTE, BOOKMARKS, GENERAL_BOOKMARKS } from "@habla/const";
import { findTag } from "@habla/tags";

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
  showReactions = true,
  skipModeration = false,
  isDetail = false,
  ...props
}) {
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const a = findTag(event, "a");
  const e = findTag(event, "e");
  const r = findTag(event, "r");
  const cleanR = useMemo(() => {
    try {
      const url = new URL(r);
      return `${url.protocol}//${url.hostname}${url.pathname}`;
    } catch (error) {
      return r;
    }
  }, [r]);
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
    if (skipModeration) {
      return false;
    }
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
          {isDetail ? (
            <HStack justify="space-between">
              <User pubkey={event.pubkey} />
              <RecommendedAppMenu event={event} />
            </HStack>
          ) : (
            <User pubkey={event.pubkey} />
          )}
        </CardHeader>
      )}
      <CardBody dir="auto">
        <Stack gap="1">
          <Box
            mb={2}
            cursor="pointer"
            onClick={() => router.push(`/e/${nevent}`)}
          >
            <Blockquote style={{ margin: 0 }}>
              {context && context.length > event.content.length + 1 ? (
                <HighlightSubstring text={context} substring={event.content} />
              ) : (
                event.content
              )}
            </Blockquote>
          </Box>
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
                {cleanR}
              </Text>
            </ExternalLink>
          )}
          {e && !naddr && <EventTitle id={e} />}
        </Stack>
      </CardBody>
      {showReactions && (
        <CardFooter dir="auto">
          <Reactions
            event={event}
            kinds={[ZAP, REPOST, NOTE, BOOKMARKS, GENERAL_BOOKMARKS]}
            live={inView}
          />
        </CardFooter>
      )}
    </Card>
  ) : null;
}
