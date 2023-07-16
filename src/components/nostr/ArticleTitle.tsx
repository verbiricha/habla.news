import { Heading } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import ArticleLink from "@habla/components/nostr/ArticleLink";

export default function ArticleTitle({
  naddr,
  kind,
  identifier,
  pubkey,
  ...rest
}) {
  const event = useEvent({
    kinds: [kind],
    "#d": [identifier],
    authors: [pubkey],
  });

  const { title } = event ? getMetadata(event) : {};
  const content = (
    <Heading fontSize="xl" {...rest}>
      {title}
    </Heading>
  );
  return event ? <ArticleLink event={event}>{content}</ArticleLink> : content;
}
