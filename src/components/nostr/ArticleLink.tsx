import Link from "next/link";
import { useMemo } from "react";

import { nip19 } from "nostr-tools";
import { getHandle } from "@habla/nip05";
import { getMetadata } from "@habla/nip23";
import { useUser } from "@habla/nostr/hooks";
import { articleURL } from "@habla/urls";
import { useNostrAddress } from "@habla/hooks/useNostrAddress";

export function articleAddress(event) {
  const { identifier } = getMetadata(event);
  return nip19.naddrEncode({
    kind: event.kind,
    pubkey: event.pubkey,
    identifier,
  });
}

export function articleLink(event, profile, isVerified) {
  const { kind, pubkey } = event;
  const { identifier } = getMetadata(event);

  if (identifier) {
    return articleURL(identifier, pubkey, profile, isVerified);
  }

  if (pubkey) {
    const naddr = nip19.naddrEncode({
      kind,
      pubkey,
      identifier: identifier ?? "",
    });

    return `/a/${naddr}`;
  }
}

export default function ArticleLink({ event, children, ...rest }) {
  const profile = useUser(event.pubkey);
  const { data } = useNostrAddress(profile?.nip05);
  const link = useMemo(() => {
    return articleLink(event, profile, data?.pubkey === event.pubkey);
  }, [event, profile, data]);

  return link ? (
    <Link href={link} {...rest}>
      {children}
    </Link>
  ) : (
    children
  );
}
