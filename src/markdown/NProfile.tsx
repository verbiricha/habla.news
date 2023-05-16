import Link from "next/link";

import Username from "@habla/components/nostr/Username";

export default function NProfile({ pubkey, relays, nprofile }) {
  return (
    <Link href={`https://snort.social/p/${nprofile}`}>
      <Username as="span" pubkey={pubkey} fontFamily="'Source Serif Pro'" />
    </Link>
  );
}
