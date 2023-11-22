import Link from "next/link";
import { Text, Code, Spinner } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  HIGHLIGHT,
  LISTS,
  COMMUNITY,
  APP,
} from "@habla/const";
import List from "@habla/components/nostr/List";
import Community from "@habla/components/nostr/feed/Community";
import ArticleLink from "@habla/components/nostr/ArticleLink";
import App from "@habla/components/nostr/App";
import UnknownKind from "@habla/components/nostr/UnknownKind";

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
    const content = (
      <Text as="span" fontWeight={500} {...rest}>
        {title}
      </Text>
    );
    return event ? (
      <ArticleLink className="article-link" event={event}>
        {content}
      </ArticleLink>
    ) : (
      content
    );
  }

  if (event && LISTS.includes(kind)) {
    return <List event={event} />;
  }

  if (event && kind === COMMUNITY) {
    return <Community event={event} />;
  }

  if (event?.kind === APP) {
    return <App event={event} />;
  }

  return event ? <UnknownKind event={event} /> : <Spinner />;
}
