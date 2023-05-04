import { Flex, Text } from "@chakra-ui/react";

import useSeenOn from "@habla/hooks/useSeenOn";

import RelayList from "./RelayList";

// todo: slice when too many
export default function SeenIn({ event }) {
  const relays = useSeenOn(event);
  return (
    relays.length > 0 && (
      <Flex alignItems="center" color="gray.500" gap={2}>
        <Text fontSize="sm">seen in</Text>
        <Flex alignItems="flex-start" flexDirection="column">
          <RelayList size="xs" linkToNrelay={true} relays={relays} />
        </Flex>
      </Flex>
    )
  );
}
