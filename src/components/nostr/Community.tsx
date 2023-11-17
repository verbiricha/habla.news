import { Helmet } from "react-helmet";
import { useMemo } from "react";
import { Flex, Stack, HStack, Heading, Text, Image } from "@chakra-ui/react";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { useTranslation } from "next-i18next";

import { findTag } from "@habla/tags";
import { POST_APPROVAL, HIGHLIGHT, LONG_FORM, NOTE } from "@habla/const";
import { useEvents } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import Events from "@habla/components/nostr/feed/Events";
import { FollowCommunityButton } from "@habla/components/nostr/FollowButton";
import { MuteReferenceButton } from "@habla/components/nostr/MuteButton";
import { getMetadata } from "@habla/nip72";
import useModeration from "@habla/hooks/useModeration";
import useHashtags from "@habla/hooks/useHashtags";

export default function Community({ event }) {
  const { t } = useTranslation("common");
  const { name, description, image, rules } = getMetadata(event);
  const moderators = event.tags
    .filter((t) => t.at(0) === "p" && t.includes("moderator"))
    .map((t) => t.at(1));
  const address = `${event.kind}:${event.pubkey}:${name}`;
  const { events } = useEvents({
    kinds: [HIGHLIGHT, LONG_FORM, NOTE],
    "#a": [address],
  });
  const approvals = useEvents(
    {
      authors: moderators,
      kinds: [POST_APPROVAL],
      "#a": [address],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    }
  );

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.pubkey === event.pubkey || moderators.includes(e.pubkey)) {
        return true;
      }

      if ([NOTE, HIGHLIGHT].includes(e.kind)) {
        return approvals.events.find((a) => findTag(a, "e") === e.id);
      }
      const d = findTag(e, "d");
      const addr = `${e.kind}:${e.pubkey}:${d}`;
      return approvals.events.find(
        (a) => findTag(a, "e") === e.id || findTag(a, "a") === addr
      );
    });
  }, [events, approvals.events]);
  const hashtags = useHashtags(event);
  const { mutedWords, isTagMuted } = useModeration();
  const isHidden = useMemo(() => {
    return (
      isTagMuted(["p", event.pubkey]) ||
      isTagMuted(event.tagReference()) ||
      hashtags.some((t) => isTagMuted(["t", t])) ||
      mutedWords.some((w) => {
        const word = w.toLowerCase();
        return (
          name.toLowerCase().includes(word) ||
          description?.toLowerCase().includes(word)
        );
      })
    );
  }, [mutedWords, isTagMuted]);

  return isHidden ? null : (
    <>
      <Helmet>
        <title>{name}</title>
        <meta name="og:title" content={name} />
        <meta property="og:type" content="article" />
        <meta name="og:description" content={description} />
        {image && <meta name="og:image" content={image} />}
      </Helmet>
      <Flex flexDir="column">
        <Flex flexDir="column" gap={[4, 12]} w="100%">
          {image && <Image width="100%" maxH="320px" fit="cover" src={image} />}
          <Stack flex="1">
            <Flex justifyContent="space-between" direction={["column", "row"]}>
              <Heading>{name}</Heading>
              <HStack gap={2}>
                <MuteReferenceButton reference={event.tagReference()} />
                <FollowCommunityButton reference={event.tagReference()} />
              </HStack>
            </Flex>
            <Text fontSize="lg">{description}</Text>
            <Heading as="h4" fontSize="lg" mt={4}>
              {t("moderators")}
            </Heading>
            <Flex gap={6} flexWrap="wrap">
              {moderators.map((pk) => (
                <User key={pk} pubkey={pk} />
              ))}
            </Flex>
            {rules.length > 0 && (
              <>
                <Heading as="h4" fontSize="lg" mt={4}>
                  {t("rules")}
                </Heading>
                <Text fontSize="md">{rules}</Text>
              </>
            )}
          </Stack>
        </Flex>
        <Events events={filteredEvents} />
      </Flex>
    </>
  );
}
