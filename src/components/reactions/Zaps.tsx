import { useMemo, useState } from "react";
import { useDisclosure, Flex, Text, IconButton } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import ZapIcon from "@habla/icons/Zap";
import { getZapRequest, getZapAmount } from "@habla/nip57";
import { ZAP } from "@habla/const";
import { formatShortNumber } from "@habla/format";
import ZapModal from "@habla/components/ZapModal";

export default function Zaps({ event, zaps }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zappers = useMemo(() => {
    return zaps.map((z) => {
      return { ...getZapRequest(z), amount: getZapAmount(z) };
    });
  }, [zaps]);
  const zapped = zappers.some((z) => z.pubkey === pubkey);
  const zapsTotal = useMemo(() => {
    return zappers.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  }, [zappers]);

  return (
    <>
      <Flex alignItems="center" gap="3">
        <IconButton
          cursor="pointer"
          variant="unstyled"
          onClick={onOpen}
          size={5}
          color={zapped ? "purple.500" : "secondary"}
          as={ZapIcon}
        />
        <Text fontSize="xl">{formatShortNumber(zapsTotal)}</Text>
      </Flex>
      <ZapModal isOpen={isOpen} onClose={onClose} event={event} />
    </>
  );
}
