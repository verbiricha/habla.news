import { useMemo } from "react";
import Link from "next/link";

import {
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { nip19 } from "nostr-tools";

import { ZAP, REACTION, NOTE } from "@habla/const";
import useSeenOn from "@habla/hooks/useSeenOn";
import NAddr from "@habla/markdown/Naddr";
import { useEvent } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";
import Reactions from "@habla/components/nostr/Reactions";
import User from "@habla/components/nostr/User";

export default function Highlight({ event, relays, showHeader = true }) {
  const a = findTag(event, "a");
  const r = findTag(event, "r");
  const seenOn = useSeenOn(event);
  const [kind, pubkey, identifier] = a?.split(":") ?? [];
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
    <Card variant="unstyled">
      {showHeader && (
        <CardHeader>
          {naddr && (
            <Stack direction="column" spacing="1">
              <ArticleTitle
                naddr={naddr}
                kind={Number(kind)}
                identifier={identifier}
                pubkey={pubkey}
              />
              <User pubkey={pubkey} relays={relays} />
            </Stack>
          )}
          {r && !naddr && !r.startsWith("https://habla.news") && (
            <Link href={r}>
              <Heading fontSize="2xl">{r}</Heading>
            </Link>
          )}
        </CardHeader>
      )}
      <CardBody>
        {naddr ? (
          <Link shallow={true} href={`/a/${naddr}`}>
            <Prose mt={-6} mb={-2}>
              <Text as="blockquote">{event.content}</Text>
            </Prose>
          </Link>
        ) : (
          <Prose mt={-6} mb={-2}>
            <Text as="blockquote">{event.content}</Text>
          </Prose>
        )}
        <User pubkey={event.pubkey} relays={relays} />
      </CardBody>
      <CardFooter>
        <Reactions event={event} kinds={[ZAP, REACTION, NOTE]} />
      </CardFooter>
    </Card>
  ) : null;
}
