import { Flex, Text } from "@chakra-ui/react";

import useSeenOn from "@habla/hooks/useSeenOn";

import RelayList from "./RelayList";

// todo: slice when too many
export default function SeenIn({ event }) {
  const relays = useSeenOn(event);
  // todo: show when relay page is ready
  return null;
  //(
  //  relays.length > 0 && (
  //    <Flex alignItems="center" color="gray.500" gap={2} fontFamily="'Inter'">
  //      <Text fontSize="xs">seen in</Text>
  //      <Flex alignItems="flex-start" flexDirection="column">
  //        <RelayList size="xs" linkToNrelay={true} relays={relays} />
  //      </Flex>
  //    </Flex>
  //  )
  //);
}
