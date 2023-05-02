import { Flex, Text, Stack } from "@chakra-ui/react";

import User from "@habla/components/nostr/User";

export default function TextReactions({ event, reactions }) {
  return (
    <Stack spacing="3">
      {reactions.map((r) => {
        return (
          <Flex alignItems="center" gap="2">
            <User pubkey={r.pubkey} />
            {r.content === "+" && <Text fontSize="md">liked</Text>}
            {r.content === "-" && <Text fontSize="md">disliked</Text>}
            {!["+", "-"].includes(r.content) && (
              <Text fontSize="md">reacted with {r.content}</Text>
            )}
          </Flex>
        );
      })}
    </Stack>
  );
}
