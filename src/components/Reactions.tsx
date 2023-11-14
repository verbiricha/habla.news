import { useMemo } from "react";
import { useAtom } from "jotai";

import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Flex, Text, Icon } from "@chakra-ui/react";

import { useNdk } from "@habla/nostr/hooks";
import { formatShortNumber } from "@habla/format";
import { pubkeyAtom } from "@habla/state";
import Heart from "@habla/icons/Heart";

export default function Reactions({ event, reactions, highlights }) {
  const ndk = useNdk();
  const [pubkey] = useAtom(pubkeyAtom);
  const likes = useMemo(
    () =>
      reactions.filter((e) => e.content === "+" && e.pubkey !== event.pubkey),
    [reactions]
  );
  const liked = likes.some((e) => e.pubkey === pubkey);
  async function react() {
    if (!liked) {
      try {
        const reaction = {
          kind: 7,
          content: "+",
          created_at: Math.floor(Date.now() / 1000),
          tags: [event.tagReference(), ["p", event.pubkey]],
        };
        const signed = await window.nostr.signEvent(reaction);
        const ndkEv = new NDKEvent(ndk, signed);
        ndk.publish(ndkEv);
      } catch (error) {
        console.error("Couldn't publish");
      }
    }
  }
  return (
    <Flex alignItems="center" color="secondary" fontFamily="'Inter'" gap={3}>
      <Icon
        variant="unstyled"
        onClick={react}
        cursor={liked ? "auto" : "pointer"}
        variant="unstyled"
        color={liked ? "highlight" : "secondary"}
        as={Heart}
        boxSize={3}
      />
      <Text fontSize="sm">{formatShortNumber(likes.length)}</Text>
    </Flex>
  );
}
