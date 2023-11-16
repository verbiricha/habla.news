import { useMemo } from "react";
import { useDisclosure, Flex, Text, Icon } from "@chakra-ui/react";

import { getZapRequest, getZapAmount } from "@habla/nip57";
import ZapIcon from "@habla/icons/Zap";
import ZapModal from "@habla/components/ZapModal";
import ReactionCount from "@habla/components/reactions/ReactionCount";

export default function Zaps({ event, zaps }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zapRequests = useMemo(() => {
    return zaps.map((z) => {
      return { ...getZapRequest(z), amount: getZapAmount(z) };
    });
  }, [zaps]);
  const zapsTotal = useMemo(() => {
    return zapRequests.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  }, [zapRequests]);

  return (
    <>
      <ReactionCount
        cursor="pointer"
        icon={ZapIcon}
        reactions={zapRequests}
        onClick={isOpen ? onClose : onOpen}
        count={zapsTotal}
      />
      <ZapModal isOpen={isOpen} onClose={onClose} event={event} />
    </>
  );
}
