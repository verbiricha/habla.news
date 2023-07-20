import { useMemo } from "react";
import { useRouter } from "next/router";

import {
  Avatar,
  Flex,
  Stack,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import { getBadge } from "@habla/nip58";
import User from "@habla/components/nostr/User";

export default function Badge({ naddr, event }) {
  const router = useRouter();
  const { name, description, image } = getBadge(event);
  return (
    <Card variant="outline" my={4}>
      <CardBody
        cursor="pointer"
        onClick={() => router.push(`https://badges.page/b/${naddr}`)}
      >
        <Flex alignItems="center" gap="6">
          <Avatar src={image} alt={name} size="xl" />
          <Stack>
            <Text>{name}</Text>
            {description && <Text>{description}</Text>}
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );
}
