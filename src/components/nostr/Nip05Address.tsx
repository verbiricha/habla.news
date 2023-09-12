import { nip19 } from "nostr-tools";

import { useNostrAddress } from "@habla/hooks/useNostrAddress";
import Address from "@habla/components/nostr/Address";
import NotFound from "@habla/components/NotFound";
import { LONG_FORM } from "@habla/const";

export default function NostrAddressProfile({ query, identifier }) {
  const { isError, data } = useNostrAddress(query);
  if (data) {
    const { pubkey, relays } = data;
    const naddr = nip19.naddrEncode({ pubkey, relays, identifier });
    return (
      <Address
        identifier={identifier}
        kind={LONG_FORM}
        pubkey={pubkey}
        relays={relays}
      />
    );
  } else if (isError) {
    return <NotFound />;
  }
  return null;
}
