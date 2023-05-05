import { useMemo, useState } from "react";
import { useDisclosure, Flex, Text, IconButton } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { pubkeyAtom } from "@habla/state";
import ZapIcon from "@habla/icons/Zap";
import { getZapRequest, getZapAmount } from "@habla/nip57";
import { ZAP } from "@habla/const";
import { formatShortNumber } from "@habla/format";
import ZapModal from "@habla/components/ZapModal";
import ReactionCount from "@habla/components/reactions/ReactionCount";

export default function Zaps({ event, zaps }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zappers = useMemo(() => {
    return zaps
      .map((z) => {
        return { ...getZapRequest(z), amount: getZapAmount(z) };
      })
      .filter((z) => z.pubkey !== event.pubkey);
  }, [zaps]);
  const zapped = zappers.some((z) => z.pubkey === pubkey);
  const zapsTotal = useMemo(() => {
    return zappers.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  }, [zappers]);

  return (
    <>
      <Flex alignItems="center" color="secondary" fontFamily="'Inter'">
        <IconButton
          cursor="pointer"
          variant="unstyled"
          onClick={onOpen}
          boxSize={3}
          color={zapped ? "highlight" : "secondary"}
          as={ZapIcon}
        />
        <Text fontSize="sm">{formatShortNumber(zapsTotal)}</Text>
      </Flex>

      <ZapModal isOpen={isOpen} onClose={onClose} event={event} />
    </>
  );
}
