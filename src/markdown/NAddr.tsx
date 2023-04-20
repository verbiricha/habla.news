import Link from "next/link";

import { Text } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  ZAP,
  HIGHLIGHT,
  REACTION,
  BADGE,
} from "@habla/const";
import Badge from "@habla/components/nostr/Badge";

export default function Naddr({
  naddr,
  kind,
  identifier,
  pubkey,
  relays,
  ...rest
}) {
  const event = useEvent(
    {
      kinds: [kind],
      "#d": [identifier],
      authors: [pubkey],
    },
    { relays }
  );

  if (kind === LONG_FORM || kind === LONG_FORM_DRAFT) {
    const { title } = event ? getMetadata(event) : {};
    return (
      <Link href={`/a/${naddr}`}>
        <Text as="span" fontWeight={500} {...rest}>
          {title}
        </Text>
      </Link>
    );
  }

  if (event && kind === BADGE) {
    return <Badge naddr={naddr} event={event} relays={relays} />;
  }

  return (
    <Link href={`/a/${naddr}`}>
      <Text as="span" fontWeight={500} {...rest}>
        {naddr}
      </Text>
    </Link>
  );
}
