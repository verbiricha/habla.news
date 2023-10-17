import { Helmet } from "react-helmet";
import { Flex, HStack, Box, Stack, Text } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { useEvents, useUser } from "@habla/nostr/hooks";
import Markdown from "@habla/markdown/Markdown";
import MuteButton from "@habla/components/nostr/MuteButton";
import FollowButton from "@habla/components/nostr/FollowButton";

import User from "./User";
import { UserAvatar } from "./Avatar";
import UserContent from "./UserContent";

function Bio({ profile }) {
  return profile?.about ? (
    <Prose fontFamily="'Inter'" style={{ wordBreak: "break-word" }}>
      <Markdown content={profile?.about} />
    </Prose>
  ) : null;
}

export function ProfileHeading({ profile, pubkey, relays }) {
  return (
    <Flex
      gap="4"
      flexDirection={["column", "row"]}
      alignItems={["center", "flex-start"]}
      mb={5}
      width="100%"
    >
      <UserAvatar pubkey={pubkey} user={profile} size="xl" />
      <Stack flex={1}>
        <Flex
          flexDir={["column", "row"]}
          alignItems="center"
          justifyContent="space-between"
        >
          <User
            pubkey={pubkey}
            fontSize="2xl"
            fontWeight="500"
            showAvatar={false}
            showNostrAddress={true}
          />
          <HStack>
            <MuteButton pubkey={pubkey} />
            <FollowButton pubkey={pubkey} />
          </HStack>
        </Flex>
        <Bio profile={profile} />
      </Stack>
    </Flex>
  );
}

export default function Profile({ pubkey, relays }) {
  const profile = useUser(pubkey);
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT],
      authors: [pubkey],
    },
    { relays, cacheUsage: "PARALLEL" }
  );
  return (
    <>
      <Helmet>
        <title>{profile?.name || pubkey}</title>
      </Helmet>
      <Stack align="center">
        <ProfileHeading profile={profile} pubkey={pubkey} relays={relays} />
        <UserContent pubkey={pubkey} events={events} />
      </Stack>
    </>
  );
}
