import { useMemo } from "react";

import Link from "next/link";

import { nip19 } from "nostr-tools";

export default function RelayLink({ url, children }) {
  const nrelay = useMemo(() => nip19.nrelayEncode(url), [url]);
  return (
    <Link href={`/r/${nrelay}`} shallow>
      {children}
    </Link>
  );
}
