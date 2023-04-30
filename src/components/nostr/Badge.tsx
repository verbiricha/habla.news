import { useMemo } from "react";
import { useRouter } from "next/router";

import {
  Avatar,
  Flex,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import { getBadge } from "@habla/nip58";
import useSeenOn from "@habla/hooks/useSeenOn";
import User from "@habla/components/nostr/User";

export default function Badge({ naddr, event }) {
  const router = useRouter();
  const { name, description, image } = getBadge(event);
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
        <Flex alignItems="center" justifyContent="space-between">
          <Text>{name}</Text>
          <User pubkey={event.pubkey} />
        </Flex>
      </CardHeader>
      <CardBody cursor="pointer" onClick={() => router.push(`/e/${nevent}`)}>
        <Flex alignItems="center" gap="6">
          <Avatar src={image} alt={name} size="xl" />
          {description && <Text>{description}</Text>}
        </Flex>
      </CardBody>
    </Card>
  );
}
