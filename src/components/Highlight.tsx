import { useMemo } from "react";
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

import { findTag } from "@habla/tags";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Reactions from "@habla/components/nostr/LazyReactions";
import User from "@habla/components/nostr/User";
import Blockquote from "@habla/components/Blockquote";
import ExternalLink from "@habla/components/ExternalLink";

export default function Highlight({ event }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const a = findTag(event, "a");
  const r = findTag(event, "r");
  const p = findTag(event, "p");
  const [kind, pubkey, identifier] = a?.split(":") ?? [];
  const nevent = useMemo(() => {
    return nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
    });
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
            <ExternalLink href={r}>
              <Heading fontSize="2xl">{r}</Heading>
            </ExternalLink>
            {p && <User pubkey={p} />}
          </Stack>
        )}
      </CardHeader>
      <CardBody dir="auto">
        <Blockquote>{event.content}</Blockquote>
        <User pubkey={event.pubkey} />
      </CardBody>
      <CardFooter dir="auto">
        <Reactions event={event} live={inView} />
      </CardFooter>
    </Card>
  ) : null;
}
