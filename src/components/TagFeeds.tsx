import { useState, useMemo } from "react";
import { Flex, Heading } from "@chakra-ui/react";

import { LONG_FORM } from "@habla/const";
import Feed from "@habla/components/nostr/Feed";
import { FollowTagButton } from "@habla/components/nostr/FollowButton";

export default function TagFeeds({ tag }) {
  return (
    <>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Heading>#{tag}</Heading>
        <FollowTagButton tag={tag} />
      </Flex>
      <Feed
        filter={{ kinds: [LONG_FORM], "#t": [tag], limit: 100 }}
        options={{ cacheUsage: "PARALLEL", closeOnEose: true }}
      />
    </>
  );
}
