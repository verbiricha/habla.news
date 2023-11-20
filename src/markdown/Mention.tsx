import Link from "next/link";

import { nip19 } from "nostr-tools";

import Username from "@habla/components/nostr/Username";

export default function Mention({ pubkey }) {
  return <Username as="span" renderLink pubkey={pubkey} />;
}
