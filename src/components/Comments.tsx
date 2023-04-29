import { useMemo } from "react";

import { Flex, Text, Icon } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";
import CommentIcon from "@habla/icons/Comment";

export default function Comments({ event, comments }) {
  return (
    <Flex alignItems="center" gap="2">
      <Icon as={CommentIcon} />
      <Text fontSize="xl">{formatShortNumber(comments.length)}</Text>
    </Flex>
  );
}
