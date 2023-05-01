import { useMemo } from "react";
import { useRouter } from "next/router";

import {
  Flex,
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { nip19 } from "nostr-tools";

import { ZAP } from "@habla/const";
import useSeenOn from "@habla/hooks/useSeenOn";
import Markdown from "@habla/markdown/Markdown";
import Reactions from "@habla/components/nostr/Reactions";
import User from "./User";

export default function Note({ event }) {
  const router = useRouter();
  const seenOn = useSeenOn(event);
  const nevent = useMemo(() => {
    return nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
      relays: seenOn,
    });
  }, [event, seenOn]);
  return (
    <Card variant="outline" my={4}>
      <CardHeader>
        <User pubkey={event.pubkey} size="sm" />
      </CardHeader>
      <CardBody cursor="pointer" onClick={() => router.push(`/e/${nevent}`)}>
        <Markdown content={event.content} tags={event.tags} />
      </CardBody>
      <CardFooter>
        <Reactions event={event} kinds={[ZAP]} />
      </CardFooter>
    </Card>
  );
}
