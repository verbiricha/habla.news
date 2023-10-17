import { Flex, Heading, HStack } from "@chakra-ui/react";

import Feed from "@habla/components/nostr/feed/Feed";
import { FollowTagButton } from "@habla/components/nostr/FollowButton";
import { MuteTagButton } from "@habla/components/nostr/MuteButton";
import { LONG_FORM } from "@habla/const";

export default function TagFeeds({ tag }) {
  return (
    <>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Heading>#{tag}</Heading>
        <HStack>
          <MuteTagButton tag={tag} />
          <FollowTagButton tag={tag} />
        </HStack>
      </Flex>
      <Feed filter={{ kinds: [LONG_FORM], "#t": [tag] }} limit={21} />
    </>
  );
}
