import Link from "next/link";

import { nip19 } from "nostr-tools";

import Username from "@habla/components/nostr/Username";

export default function Mention({ pubkey }) {
  return (
    <Link href={`https://snort.social/p/${nip19.npubEncode(pubkey)}`}>
      <Username as="span" pubkey={pubkey} fontFamily="'Source Serif Pro'" />
    </Link>
  );
}
