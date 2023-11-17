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
import { parseJSON } from "@habla/util";
import Hashtags from "@habla/components/Hashtags";
import useHashtags from "@habla/hooks/useHashtags";

export default function App({ event }) {
  const publisherPubkey = event.pubkey;
  const authorPubkey = useMemo(() => {
    const authorTag = event.tags.find(
      (t) => t.at(0) === "p" && t.at(3) === "author"
    );
    return authorTag?.at(1) || event.pubkey;
  }, [event]);
  const naddr = useMemo(() => {
    return event.encode();
  }, [event]);
  const hashtags = useHashtags(event);
  const author = useUser(authorPubkey);
  const appProfile = useMemo(() => {
    return parseJSON(event.content, author);
  }, [event, author]);
  return (
    <Card variant="outline" my={4} maxW="320px">
      <CardHeader>
        <Flex align="center" justifyContent="space-between">
          <Stack>
            <Heading style={{ margin: 0 }}>
              {appProfile?.display_name || appProfile?.name}
            </Heading>
          </Stack>
          <ExternalLinkIcon href={`https://nostrapp.link/a/${naddr}`} />
        </Flex>
        <Flex ml={2}>
          {authorPubkey?.length === 64 && (
            <User size="xs" pubkey={authorPubkey} />
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack align="center">
          <Avatar
            src={appProfile?.picture}
            alt={appProfile?.display_name || appProfile?.name}
            size="xl"
          />
          {appProfile?.about && <Text>{appProfile?.about}</Text>}
          <Hashtags hashtags={hashtags} />
        </Stack>
      </CardBody>
    </Card>
  );
}
