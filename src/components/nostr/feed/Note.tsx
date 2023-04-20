import { Text, Card, CardHeader, CardBody } from "@chakra-ui/react";

import User from "../User";

export default function Note({ event }) {
  return (
    <Card variant="untstyled">
      <CardHeader>
        <User pubkey={event.pubkey} />
      </CardHeader>
      <CardBody>
        <Text>{event.content}</Text>
      </CardBody>
    </Card>
  );
}
