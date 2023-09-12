import { useNostrAddress } from "@habla/hooks/useNostrAddress";
import NotFound from "@habla/components/NotFound";
import Profile from "@habla/components/nostr/Profile";

export default function NostrAddressProfile({ query }) {
  const { isError, data } = useNostrAddress(query);
  if (data) {
    return <Profile pubkey={data.pubkey} relays={data.relays} />;
  } else if (isError) {
    return <NotFound />;
  }
  return null;
}
