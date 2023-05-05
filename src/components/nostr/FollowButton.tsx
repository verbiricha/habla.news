import { useAtom } from "jotai";
import { Icon, Button } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import { followsAtom } from "@habla/state";

export default function FollowButton({ pubkey }) {
  const [follows] = useAtom(followsAtom);
  const following = follows.includes(pubkey);
  return (
    <Button
      isDisabled={following}
      variant="outline"
      leftIcon={following ? <Icon as={CheckIcon} color="green.400" /> : null}
    >
      Follow
    </Button>
  );
}
