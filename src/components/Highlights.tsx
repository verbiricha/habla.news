import { useMemo } from "react";
import { useAtom } from "jotai";
import { Flex, Icon, Text } from "@chakra-ui/react";

import { pubkeyAtom } from "@habla/state";
import { formatShortNumber } from "@habla/format";
import Highlight from "@habla/icons/Highlight";

export default function Highlights({ highlights }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const highlighted = highlights.some((z) => z.pubkey === pubkey);
  return (
    <Flex alignItems="center" gap="2">
      <Icon color={highlighted ? "purple.500" : "secondary"} as={Highlight} />
      <Text fontSize="xl">{formatShortNumber(highlights.length)}</Text>
    </Flex>
  );
}
