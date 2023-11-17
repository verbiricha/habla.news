import { useMemo } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import {
  Flex,
  IconButton,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";

import Markdown from "@habla/markdown/Markdown";
import User from "@habla/components/nostr/User";
import Reactions from "@habla/components/nostr/LazyReactions";
import useModeration from "@habla/hooks/useModeration";
import useHashtags from "@habla/hooks/useHashtags";
import { ZAP, NOTE, REACTION } from "@habla/const";

export default function Note({ event, highlights = [], ...props }) {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const router = useRouter();
  const nevent = useMemo(() => {
    return nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
    });
  }, [event]);
  const hashtags = useHashtags(event);
  const { mutedWords, isTagMuted } = useModeration();
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
  return isHidden ? null : (
    <Card my={4} {...props} ref={ref}>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <User pubkey={event.pubkey} size="sm" />
          <IconButton
            cursor="pointer"
            variant="unstyled"
            boxSize={3}
            color="secondary"
            as={LinkIcon}
            onClick={() => router.push(`/e/${nevent}`)}
          />
        </Flex>
      </CardHeader>
      <CardBody dir="auto" pt={0} wordBreak="break-word">
        <Markdown
          content={event.content}
          tags={event.tags}
          highlights={highlights}
        />
      </CardBody>
      <CardFooter dir="auto">
        <Reactions event={event} kinds={[ZAP, NOTE, REACTION]} live={inView} />
      </CardFooter>
    </Card>
  );
}
