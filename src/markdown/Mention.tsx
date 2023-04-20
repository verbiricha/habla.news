import Link from "next/link";

import { nip19 } from "nostr-tools";

import { shortenString } from "../format";
import { useUser } from "../nostr/hooks";

export default function Mention({ pubkey }) {
  const profile = useUser(pubkey);
  return (
    <Link href={`https://snort.social/p/${nip19.npubEncode(pubkey)}`}>
      {profile?.displayName || profile?.name || shortenString(pubkey, 8)}
    </Link>
  );
}
