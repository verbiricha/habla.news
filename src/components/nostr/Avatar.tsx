import { useMemo } from "react";
import { Avatar as BaseAvatar } from "@chakra-ui/react";

import { useUser } from "@habla/nostr/hooks";
import { useRandomAvatar } from "@habla/hooks/useRandomAvatar";

function hexToDecimal(hexString) {
  const decimalValue = BigInt("0x" + hexString);
  const maxValue = BigInt(
    "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  );
  return Number(decimalValue) / Number(maxValue);
}

export default function Avatar({ pubkey, size = "sm", ...rest }) {
  const user = useUser(pubkey);
  const seed = useMemo(() => hexToDecimal(pubkey), [pubkey]);
  const placeholder = useRandomAvatar(seed);
  return (
    <BaseAvatar
      name={user?.name || pubkey}
      size={size}
      src={user?.picture || user?.image || placeholder}
      {...rest}
    />
  );
}
