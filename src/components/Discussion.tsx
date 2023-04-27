import { useMemo } from "react";
import { useAtom } from "jotai";

import { Flex, Text, Icon } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";
import { pubkeyAtom } from "@habla/state";
import CommentIcon from "@habla/icons/Comment";

export default function Discussion({ event, comments }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const commented = useMemo(
    () => comments.find((e) => e.pubkey === pubkey),
    [comments]
  );
  return (
    <Flex alignItems="center" gap="2">
      <Icon color={commented ? "purple.500" : "secondary"} as={CommentIcon} />
      <Text fontSize="xl">{formatShortNumber(comments.length)}</Text>
    </Flex>
  );
}
