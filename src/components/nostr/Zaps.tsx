import { useMemo } from "react";

import { Flex, Text, Stack } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";
import { getZapRequest, getZapAmount } from "@habla/nip57";
import User from "@habla/components/nostr/User";

export default function Zaps({ event, zaps }) {
  const zappers = useMemo(() => {
    return zaps.map((z) => {
      return { ...z, ...getZapRequest(z), amount: getZapAmount(z) };
    });
  }, [zaps]);
  const sorted = useMemo(() => {
    const s = [...zappers];
    s.sort((a, b) => b.amount - a.amount);
    return s;
  }, [zappers]);
  return (
    <Stack spacing="3">
      {sorted.map((z) => {
        return (
          <Flex key={z.id} alignItems="center" gap="1">
            <User pubkey={z.pubkey} />
            <Text as="span" fontSize="lg" fontWeight={500}>
              {formatShortNumber(z.amount)}
            </Text>
          </Flex>
        );
      })}
    </Stack>
  );
}
