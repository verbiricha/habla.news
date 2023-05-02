import Link from "next/link";

import { shortenString } from "../format";
import { useUser } from "../nostr/hooks";

export default function NProfile({ pubkey, relays, nprofile }) {
  const profile = useUser(pubkey);
  return (
    <Link href={`/p/${nprofile}`}>
      {profile?.name || shortenString(pubkey, 8)}
    </Link>
  );
}
