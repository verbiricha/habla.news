import { nip19 } from "nostr-tools";

import { useUser } from "@habla/nostr/hooks";
import { getHandle } from "@habla/nip05";
import { useNostrAddress } from "@habla/hooks/useNostrAddress";

export function useProfileLink(pubkey: string, relays: string[]) {
  const user = useUser(pubkey);
  const handle = getHandle(pubkey);
  const { data } = useNostrAddress(user?.nip05);
  const isVerified = data?.pubkey === pubkey;
  const url = handle
    ? `/${handle}`
    : user?.nip05 && isVerified
    ? `/u/${user.nip05}`
    : `/p/${nip19.nprofileEncode({ pubkey, relays })}`;
  return { url, isVerified };
}
