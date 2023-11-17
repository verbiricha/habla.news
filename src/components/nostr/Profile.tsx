import { useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Flex,
  Box,
  HStack,
  Stack,
  Heading,
  Text,
  Image,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import {
  LONG_FORM,
  HIGHLIGHT,
  BOOKMARKS,
  SUPPORT,
  deprecatedBookmarkLists,
} from "@habla/const";
import { useEvents, useUser } from "@habla/nostr/hooks";
import Markdown from "@habla/markdown/Markdown";
import MuteButton from "@habla/components/nostr/MuteButton";
import FollowButton from "@habla/components/nostr/FollowButton";
import SectionHeading from "@habla/components/SectionHeading";
import People from "@habla/components/nostr/People";

import User from "./User";
import Avatar, { UserAvatar } from "./Avatar";
import UserContent from "./UserContent";

function Bio({ profile }) {
  return profile?.about ? (
    <Box fontSize="sm">
      <Markdown content={profile?.about} />
    </Box>
  ) : null;
}

export function ProfileHeading({
  profile,
  pubkey,
  relays,
  supports,
  supporters,
}) {
  const { t } = useTranslation("common");
  // todo: amounts ban be fiat or sats
  const supporterPubkeys = useMemo(() => {
    return [
      ...supporters
        .sort((a, b) => {
          return Number(b.tagValue("amount")) - Number(a.tagValue("amount"));
        })
        .reduce((acc, ev) => {
          acc.add(ev.pubkey);
          return acc;
        }, new Set()),
    ];
  }, [supporters]);
  const supportingPubkeys = useMemo(() => {
    return [
      ...supports
        .sort((a, b) => {
          return Number(b.tagValue("amount")) - Number(a.tagValue("amount"));
        })
        .reduce((acc, ev) => {
          acc.add(ev.tagValue("p"));
          return acc;
        }, new Set()),
    ];
  }, [supports]);
  return (
    <>
      <Flex
        gap="4"
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
        mb={5}
        w="100%"
      >
        <Box display={{ base: "none", md: "block" }}>
          <UserAvatar pubkey={pubkey} user={profile} size="xl" />
        </Box>
        <Stack flex={1} w="100%">
          <Flex
            flexDir={["column", "row"]}
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex
              gap={2}
              align="flex-start"
              direction="row"
              justifyContent="space-between"
              w="100%"
            >
              <User
                pubkey={pubkey}
                fontSize="2xl"
                fontWeight="500"
                showAvatar={false}
                showNostrAddress={true}
              />
              <HStack>
                <MuteButton size={{ base: "sm", sm: "md" }} pubkey={pubkey} />
                <FollowButton size={{ base: "sm", sm: "md" }} pubkey={pubkey} />
              </HStack>
            </Flex>
          </Flex>
          <Bio profile={profile} />
          <Flex direction={["column", "row"]} gap={[2, 6]} w="100%">
            {supporterPubkeys.length > 0 && (
              <Stack>
                <SectionHeading my={1}>
                  {t("supporters", { n: supporterPubkeys.length })}
                </SectionHeading>
                <People pubkeys={supporterPubkeys} />
              </Stack>
            )}
            {supportingPubkeys.length > 0 && (
              <Stack>
                <SectionHeading my={1}>
                  {t("supports", { n: supportingPubkeys.length })}
                </SectionHeading>
                <People pubkeys={supportingPubkeys} />
              </Stack>
            )}
          </Flex>
        </Stack>
      </Flex>
    </>
  );
}

export default function Profile({ pubkey, relays }) {
  const profile = useUser(pubkey);
  const { events: supporterEvents } = useEvents(
    {
      kinds: [SUPPORT],
      "#p": [pubkey],
    },
    { relays, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL }
  );
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, HIGHLIGHT, SUPPORT, BOOKMARKS],
      authors: [pubkey],
    },
    { relays, cacheUsage: NDKSubscriptionCacheUsage.PARALLEL }
  );
  const supports = useMemo(() => {
    return events.filter((ev) => ev.kind === SUPPORT);
  }, [events]);
  const bookmarks = useMemo(() => {
    return events.filter(
      (ev) =>
        ev.kind === BOOKMARKS && !deprecatedBookmarkLists.has(ev.tagValue("d"))
    );
  }, [events]);
  return (
    <>
      <Helmet>
        <title>{profile?.name || pubkey}</title>
      </Helmet>
      <Stack align="center">
        <ProfileHeading
          profile={profile}
          pubkey={pubkey}
          relays={relays}
          supports={supports}
          supporters={supporterEvents}
        />
        <UserContent pubkey={pubkey} events={events} bookmarks={bookmarks} />
      </Stack>
    </>
  );
}
