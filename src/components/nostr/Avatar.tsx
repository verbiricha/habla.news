import { useRouter } from "next/router";

import { useMemo } from "react";
import {
  Tooltip,
  Avatar as BaseAvatar,
  AvatarBadge,
  Icon,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import { useUser } from "@habla/nostr/hooks";
import { useRandomAvatar } from "@habla/hooks/useRandomAvatar";
import { useProfileLink } from "@habla/hooks/useProfileLink";

function hexToDecimal(hexString) {
  const decimalValue = BigInt("0x" + hexString);
  const maxValue = BigInt(
    "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
  );
  return Number(decimalValue) / Number(maxValue);
}

function NostrAddressCheck() {
  return (
    <AvatarBadge placement="top-end" bg="chakra-body-bg" boxSize="0.75em">
      <Icon as={CheckIcon} color="green.500" boxSize={"0.5em"} />
    </AvatarBadge>
  );
}

export function UserAvatar({ pubkey, user, ...rest }) {
  const seed = useMemo(() => hexToDecimal(pubkey), [pubkey]);
  const placeholder = useRandomAvatar(seed);
  const router = useRouter();
  const { url, isVerified } = useProfileLink(pubkey);
  return (
    <Tooltip label={user?.name || pubkey}>
      <BaseAvatar
        cursor="pointer"
        name={user?.name || pubkey}
        src={user?.image || user?.picture || placeholder}
        ignoreFallback
        onClick={() => router.push(url)}
        {...rest}
      >
        {isVerified && <NostrAddressCheck />}
      </BaseAvatar>
    </Tooltip>
  );
}

export default function Avatar({ pubkey, size = "sm", ...rest }) {
  const user = useUser(pubkey);
  return <UserAvatar pubkey={pubkey} user={user} size={size} {...rest} />;
}
