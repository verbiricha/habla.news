import { useMemo } from "react";

import { Flex, Text } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";
import { getZapRequest, getZapAmount } from "@habla/nip57";
import { useReactions } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import BaseLongFormNote from "@habla/components/LongFormNote";
import Highlights from "@habla/components/nostr/Highlights";

export default function LongFormNote({ event, relays }) {
  const { reactions, zaps, highlights } = useReactions(event);
  const zappers = useMemo(() => {
    return zaps
      .map((z) => {
        return { ...getZapRequest(z), amount: getZapAmount(z) };
      })
      .filter((z) => z.pubkey !== event.pubkey);
  }, [zaps]);
  return (
    <>
      <BaseLongFormNote
        event={event}
        relays={relays}
        reactions={reactions}
        highlights={highlights}
        zaps={zaps}
      />
      {zappers.map((z) => {
        return (
          <Flex gap="1">
            <User pubkey={z.pubkey} relays={relays} />
            <Text>
              zapped{" "}
              <Text as="span" fontSize="lg" fontWeight={500}>
                {formatShortNumber(z.amount)}
              </Text>
            </Text>
          </Flex>
        );
      })}
      <Highlights event={event} relays={relays} />
    </>
  );
}
