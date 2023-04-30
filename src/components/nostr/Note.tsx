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

import { ZAP, REACTION } from "@habla/const";
import { useReactions } from "@habla/nostr/hooks";
import useSeenOn from "@habla/hooks/useSeenOn";
import Markdown from "@habla/markdown/Markdown";
import User from "./User";
import Zaps from "../Zaps";
import Reactions from "../Reactions";

export default function Note({ event }) {
  const router = useRouter();
  const { reactions, zaps } = useReactions(event, [ZAP, REACTION]);
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
        <Flex alignItems="center" gap="6">
          <Zaps event={event} zaps={zaps} />
          <Reactions event={event} reactions={reactions} />
        </Flex>
      </CardFooter>
    </Card>
  );
}
