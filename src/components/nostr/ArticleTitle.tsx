import Link from "next/link";
import { Heading } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";

export default function ArticleTitle({ naddr, kind, identifier, pubkey }) {
  const event = useEvent({
    kinds: [kind],
    "#d": [identifier],
    authors: [pubkey],
  });

  const { title } = event ? getMetadata(event) : {};
  return (
    <Link href={`/a/${naddr}`}>
      <Heading size="lg">{title}</Heading>
    </Link>
  );
}
