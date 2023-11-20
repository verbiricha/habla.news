import { useMemo } from "react";
import { useTranslation } from "next-i18next";

import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Stack,
  HStack,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";

import User from "@habla/components/nostr/User";
import People from "@habla/components/nostr/People";
import { RecommendedAppMenu } from "@habla/components/nostr/UnknownKind";
import Hashtags from "@habla/components/Hashtags";
import useHashtags from "@habla/hooks/useHashtags";
import { useEvents, useUser } from "@habla/nostr/hooks";
import { APP_RECOMMENDATION } from "@habla/const";
import { dedupe, parseJSON } from "@habla/util";

export function useRecommenders(event) {
  const address = useMemo(() => {
    return event.tagId();
  }, [event]);
  const { events } = useEvents({
    kinds: [APP_RECOMMENDATION],
    "#a": [address],
  });
  const pks = useMemo(() => {
    return dedupe(events.map((ev) => ev.pubkey));
  }, [events]);
  return pks;
}

export default function App({ event }) {
  const { t } = useTranslation("common");
  const recommenders = useRecommenders(event);
  const publisherPubkey = event.pubkey;
  const authorPubkey = useMemo(() => {
    const authorTag = event.tags.find(
      (t) => t.at(0) === "p" && t.at(3) === "author"
    );
    return authorTag?.at(1) || event.pubkey;
  }, [event]);
  const hashtags = useHashtags(event);
  const author = useUser(authorPubkey);
  const appProfile = useMemo(() => {
    return parseJSON(event.content, author);
  }, [event, author]);
  return (
    <Card>
      <CardHeader>
        <Stack>
          <Flex align="center" justifyContent="space-between">
            <HStack>
              <Avatar
                src={appProfile?.picture}
                alt={appProfile?.display_name || appProfile?.name}
                size="sm"
              />
              <Heading fontSize="xl">
                {appProfile?.display_name || appProfile?.name}
              </Heading>
            </HStack>
            <RecommendedAppMenu event={event} />
          </Flex>
          {authorPubkey?.length === 64 && (
            <User size="xs" fontSize="md" pubkey={authorPubkey} />
          )}
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack gap={3}>
          {appProfile?.about && (
            <Text fontSize="md" fontFamily="body">
              {appProfile?.about}
            </Text>
          )}
          <Hashtags hashtags={hashtags} />
          {recommenders.length > 0 && <People pubkeys={recommenders} />}
        </Stack>
      </CardBody>
    </Card>
  );
}
