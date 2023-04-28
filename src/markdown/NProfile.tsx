import Link from "next/link";

import { shortenString } from "../format";
import { useUser } from "../nostr/hooks";

export default function NProfile({ pubkey, relays, nprofile }) {
  const profile = useUser(pubkey);
  return (
    <Link shallow={true} href={`/p/${nprofile}`}>
      {profile?.displayName || profile?.name || shortenString(pubkey, 8)}
    </Link>
  );
}
