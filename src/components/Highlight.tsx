import { useMemo } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

import {
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
} from "@chakra-ui/react";

import { nip19 } from "nostr-tools";

import useSeenOn from "@habla/hooks/useSeenOn";
import NAddr from "@habla/markdown/Naddr";
import { findTag } from "@habla/tags";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Reactions from "@habla/components/nostr/LazyReactions";
import User from "@habla/components/nostr/User";
import Blockquote from "@habla/components/Blockquote";

export default function Highlight({ event }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const a = findTag(event, "a");
  const r = findTag(event, "r");
  const p = findTag(event, "p");
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
    <Card variant="highlight" ref={ref}>
      <CardHeader>
        {naddr && (
          <Stack direction="column" spacing="1">
            <ArticleTitle
              naddr={naddr}
              kind={Number(kind)}
              identifier={identifier}
              pubkey={pubkey}
            />
            <User pubkey={pubkey} />
          </Stack>
        )}
        {r && !naddr && !r.startsWith("https://habla.news") && (
          <Stack direction="column" spacing="1">
            <Link href={r}>
              <Heading fontSize="2xl">{r}</Heading>
            </Link>
            {p && <User pubkey={p} />}
          </Stack>
        )}
      </CardHeader>
      <CardBody dir="auto">
        <Blockquote>{event.content}</Blockquote>
        <User pubkey={event.pubkey} />
      </CardBody>
      <CardFooter>
        <Reactions event={event} live={inView} />
      </CardFooter>
    </Card>
  ) : null;
}
