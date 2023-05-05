import { Avatar as BaseAvatar } from "@chakra-ui/react";

import { useUser } from "@habla/nostr/hooks";

export default function Avatar({ pubkey, size = "sm", ...rest }) {
  const user = useUser(pubkey);
  return (
    <BaseAvatar
      name={user?.name || pubkey}
      size={size}
      src={user?.picture || user?.image}
      {...rest}
    />
  );
}
