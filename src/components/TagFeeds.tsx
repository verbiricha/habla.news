import { useState, useMemo } from "react";
import { Flex, Heading } from "@chakra-ui/react";

import FeedPage from "@habla/components/nostr/feed/FeedPage";
import { FollowTagButton } from "@habla/components/nostr/FollowButton";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { LONG_FORM, MONTH } from "@habla/const";

export default function TagFeeds({ tag }) {
  return (
    <>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Heading>#{tag}</Heading>
        <FollowTagButton tag={tag} />
      </Flex>
      <FeedPage filter={{ kinds: [LONG_FORM], "#t": [tag] }} offset={MONTH} />
    </>
  );
}
