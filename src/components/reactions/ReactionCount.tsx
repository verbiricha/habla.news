import { useAtom } from "jotai";
import { pubkeyAtom } from "@habla/state";

import { Flex, Icon, Text } from "@chakra-ui/react";

import { formatShortNumber } from "@habla/format";

export default function ReactionCount({ icon, reactions, count, ...props }) {
  const [pubkey] = useAtom(pubkeyAtom);
  const reacted = reactions.some((r) => r.pubkey === pubkey);
  return (
    <Flex alignItems="center" color="secondary" gap={3}>
      <Icon
        variant="unstyled"
        color={reacted && "highlight"}
        as={icon}
        boxSize={3}
        {...props}
      />
      <Text as="span" color="secondary" fontSize="sm" fontFamily="body">
        {formatShortNumber(count || reactions.length)}
      </Text>
    </Flex>
  );
}
