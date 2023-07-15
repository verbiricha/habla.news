import { Avatar as BaseAvatar } from "@chakra-ui/react";

import { useUser } from "@habla/nostr/hooks";
import { useRandomAvatar } from "@habla/hooks/useRandomAvatar";

export default function Avatar({ pubkey, size = "sm", ...rest }) {
  const user = useUser(pubkey);
  const placeholder = useRandomAvatar();
  return (
    <BaseAvatar
      name={user?.name || pubkey}
      size={size}
      src={user?.picture || user?.image || placeholder}
      {...rest}
    />
  );
}
