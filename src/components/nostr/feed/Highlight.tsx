import { useMemo } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

import {
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
} from "@chakra-ui/react";

import { nip19 } from "nostr-tools";

import { ZAP, NOTE } from "@habla/const";
import useSeenOn from "@habla/hooks/useSeenOn";
import NAddr from "@habla/markdown/Naddr";
import { useEvent } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Blockquote from "@habla/components/Blockquote";
import User from "@habla/components/nostr/User";
import Reactions from "@habla/components/nostr/LazyReactions";

export default function Highlight({ event, showHeader = true }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const a = findTag(event, "a");
  const r = findTag(event, "r");
  const seenOn = useSeenOn(event);
  const [kind, pubkey, identifier] = a?.split(":") ?? [];
  const nevent = useMemo(() => {
    return nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
      relays: seenOn,
    });
  }, [event, seenOn]);
  const naddr = useMemo(() => {
    if (kind && pubkey && identifier) {
      return nip19.naddrEncode({
        identifier,
        pubkey,
        kind: Number(kind),
        relays: seenOn,
      });
    }
  }, [kind, pubkey, identifier]);
  return event.content.length < 4200 ? (
    <Card variant="highlight" key={event.id} ref={ref} my={4}>
      {showHeader && (
        <CardHeader>
          <User pubkey={event.pubkey} />
        </CardHeader>
      )}
      <CardBody dir="auto">
        <Stack gap="1">
          <Blockquote>{event.content}</Blockquote>
          {naddr && (
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
          )}
          {r && !naddr && !r.startsWith("https://habla.news") && (
            <Link href={r}>
              <Text
                fontFamily="'Inter'"
                fontWeight={600}
                fontSize="sm"
                color="secondary"
              >
                {r}
              </Text>
            </Link>
          )}
        </Stack>
      </CardBody>
      <CardFooter dir="auto">
        <Reactions event={event} kinds={[ZAP, NOTE]} live={inView} />
      </CardFooter>
    </Card>
  ) : null;
}
