import { useMemo } from "react";
import { useAtom } from "jotai";

import { Flex, Text, Icon } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";
import { pubkeyAtom } from "@habla/state";
import Heart from "@habla/icons/Heart";

export default function Reactions({ event, reactions, highlights }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const likes = useMemo(
    () =>
      reactions.filter((e) => e.content === "+" && e.pubkey !== event.pubkey),
    [reactions]
  );
  const liked = likes.some((e) => e.pubkey === pubkey);
  return (
    <Flex alignItems="center" gap="2">
      <Icon color={liked ? "purple.500" : "secondary"} as={Heart} />
      <Text fontSize="xl">{formatShortNumber(likes.length)}</Text>
    </Flex>
  );
}
