import { useAtom } from "jotai";

import { Flex, Text, IconButton } from "@chakra-ui/react";

import { pubkeyAtom } from "@habla/state";
import { formatShortNumber } from "@habla/format";
import CommentIcon from "@habla/icons/Comment";

export default function Comments({ event, comments }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const commented = comments.some((e) => e.pubkey === pubkey);
  return (
    <Flex alignItems="center" gap="3">
      <IconButton
        variant="unstyled"
        size={5}
        color={commented ? "purple.500" : "secondary"}
        as={CommentIcon}
      />
      <Text fontSize="xl">{formatShortNumber(comments.length)}</Text>
    </Flex>
  );
}
