import Link from "next/link";
import { useMemo } from "react";

import { nip19 } from "nostr-tools";
import { getHandle } from "@habla/nip05";
import { getMetadata } from "@habla/nip23";
import { useUser } from "@habla/nostr/hooks";

export function articleAddress(event) {
  const { identifier } = getMetadata(event);
  return nip19.naddrEncode({
    kind: event.kind,
    pubkey: event.pubkey,
    identifier,
  });
}

export function articleLink(event, profile) {
  const { kind, pubkey } = event;
  const { identifier } = getMetadata(event);
  const handle = getHandle(pubkey);

  if (handle && identifier) {
    return `/${handle}/${identifier}`;
  }

  if (profile && profile.nip05 && identifier) {
    const nip05handle = profile.nip05.replace(/^_@/, "");
    return `/u/${nip05handle}/${identifier}`;
  }

  if (event.pubkey) {
    const naddr = nip19.naddrEncode({
      kind: event.kind,
      pubkey: event.pubkey,
      identifier: identifier ?? "",
    });

    return `/a/${naddr}`;
  }
}

export default function ArticleLink({ event, children }) {
  const profile = useUser(event.pubkey);
  const link = useMemo(() => {
    return articleLink(event, profile);
  }, [event, profile]);

  return (
    <Link href={link} shallow>
      {children}
    </Link>
  );
}
