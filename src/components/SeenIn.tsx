import { Flex, Text } from "@chakra-ui/react";
import RelayList from "./RelayList";

// todo: slice when too many
export default function SeenIn({ relays }) {
  return (
    <Flex alignItems="flex-start" flexDirection="column">
      <RelayList size="xs" linkToNrelay={true} relays={relays} />
    </Flex>
  );
}
