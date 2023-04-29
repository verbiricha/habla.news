import { useMemo } from "react";

import { Flex, Text, Icon } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";
import Heart from "@habla/icons/Heart";

export default function Comments({ event, reactions }) {
  const comments = useMemo(
    () => reactions.filter((e) => e.kind === 1)[reactions]
  );
  return (
    <Flex alignItems="center" gap="2">
      <Icon as={Heart} />
      <Text fontSize="xl">{formatShortNumber(comments.length)}</Text>
    </Flex>
  );
}
