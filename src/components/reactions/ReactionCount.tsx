import { useAtom } from "jotai";
import { pubkeyAtom } from "@habla/state";

import { Flex, IconButton, Text } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";

export default function ReactionCount({ icon, reactions }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const reacted = reactions.some((r) => r.pubkey === pubkey);
  return (
    <Flex alignItems="center" color="secondary" fontFamily="'Inter'">
      <IconButton
        variant="unstyled"
        color={reacted && "highlight"}
        as={icon}
        boxSize={3}
      />
      <Text color="secondary" fontSize="sm">
        {formatShortNumber(reactions.length)}
      </Text>
    </Flex>
  );
}
