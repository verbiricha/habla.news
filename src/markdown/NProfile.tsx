import Link from "next/link";

import Username from "@habla/components/nostr/Username";

export default function NProfile({ pubkey, relays, nprofile }) {
  return <Username as="span" renderLink pubkey={pubkey} />;
}
