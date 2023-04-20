import { useMemo } from "react";
import { Flex, Text, Icon } from "@chakra-ui/react";

import ZapIcon from "@habla/icons/Zap";
import { getZapRequest, getZapAmount } from "@habla/nip57";
import { ZAP } from "@habla/const";
import { formatShortNumber } from "@habla/format";

export default function Zaps({ event, zaps }) {
  const zapsTotal = useMemo(() => {
    return zappers.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  }, [zappers]);

  return (
    <Flex alignItems="center" gap="2">
      <Icon as={ZapIcon} />
      <Text fontSize="xl">{formatShortNumber(zapsTotal)}</Text>
    </Flex>
  );
}
