import { useMemo } from "react";
import { Avatar as BaseAvatar, AvatarBadge, Icon } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import { useUser } from "@habla/nostr/hooks";
import { useRandomAvatar } from "@habla/hooks/useRandomAvatar";
import { useNostrAddress } from "@habla/hooks/useNostrAddress";

function hexToDecimal(hexString) {
  const decimalValue = BigInt("0x" + hexString);
  const maxValue = BigInt(
    "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  );
  return Number(decimalValue) / Number(maxValue);
}

function NostrAddressCheck({ pubkey, nip05 }) {
  const { data, isError } = useNostrAddress(nip05);
  return (
    data?.pubkey === pubkey && (
      <AvatarBadge placement="top-end" bg="chakra-body-bg" boxSize="0.75em">
        <Icon as={CheckIcon} color="green.500" boxSize={"0.5em"} />
      </AvatarBadge>
    )
  );
}

export function UserAvatar({ pubkey, user, ...rest }) {
  const seed = useMemo(() => hexToDecimal(pubkey), [pubkey]);
  const placeholder = useRandomAvatar(seed);
  return (
    <BaseAvatar
      name={user?.name || pubkey}
      src={user?.image || user?.picture || placeholder}
      ignoreFallback
      {...rest}
    >
      {user?.nip05 && <NostrAddressCheck pubkey={pubkey} nip05={user.nip05} />}
    </BaseAvatar>
  );
}

export default function Avatar({ pubkey, size = "sm", ...rest }) {
  const user = useUser(pubkey);
  return <UserAvatar pubkey={pubkey} user={user} size={size} {...rest} />;
}
