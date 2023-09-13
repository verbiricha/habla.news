import { useMemo } from "react";

import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";

import ExternalLinkIcon from "@habla/components/ExternalLinkIcon";
import User from "@habla/components/nostr/User";
import { useUser } from "@habla/nostr/hooks";

function parseJSON<T>(raw: string, defaultValue: T) {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return defaultValue;
  }
}

export default function App({ event }) {
  const publisherPubkey = event.pubkey;
  const authorPubkey = useMemo(() => {
    return (
      event.tags.find((t) => t.at(0) === "p" && t.at(3) === "author") ||
      event.pubkey
    );
  }, [event]);
  const naddr = useMemo(() => {
    return event.encode();
  }, [event]);
  const author = useUser(authorPubkey);
  const appProfile = useMemo(() => {
    return parseJSON(event.content, author);
  }, [event, author]);
  return (
    <Card variant="outline" my={4} maxW="320px">
      <CardHeader>
        <Flex align="center" justifyContent="space-between">
          <Heading style={{ margin: 0 }}>{appProfile?.name}</Heading>
          <ExternalLinkIcon href={`https://nostrapp.link/a/${naddr}`} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack align="center">
          <Avatar src={appProfile?.picture} alt={appProfile?.name} size="xl" />
          {appProfile?.about && <Text>{appProfile?.about}</Text>}
        </Stack>
      </CardBody>
    </Card>
  );
}
