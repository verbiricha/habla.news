import {
  Avatar,
  Flex,
  Text,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";

import User from "@habla/components/nostr/User";
import { getBadge } from "@habla/nip58";

export default function Badge({ naddr, event, relays }) {
  const { name, description, image } = getBadge(event);
  return (
    <Card variant="outline">
      <CardHeader>
        <User pubkey={event.pubkey} relays={relays} />
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" gap="6">
          <Avatar src={image} alt={name} size="xl" />
          {description && <Text>{description}</Text>}
        </Flex>
      </CardBody>
    </Card>
  );
}
