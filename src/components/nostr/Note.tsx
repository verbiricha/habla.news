import { useMemo } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

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

import useSeenOn from "@habla/hooks/useSeenOn";
import Markdown from "@habla/markdown/Markdown";
import User from "./User";

export default function Note({ event }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });
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
    <Card variant="outline" my={4} ref={ref}>
      <CardHeader py={0} mb={-10}>
        <User pubkey={event.pubkey} size="sm" />
      </CardHeader>
      <CardBody
        px={16}
        cursor="pointer"
        onClick={() => router.push(`https://snort.social/e/${nevent}`)}
      >
        <Prose>
          <Markdown content={event.content} tags={event.tags} />
        </Prose>
      </CardBody>
    </Card>
  );
}
