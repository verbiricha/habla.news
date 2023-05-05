import { useEvent, useReactions } from "@habla/nostr/hooks";
import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  BADGE,
  REACTION,
  LISTS,
} from "@habla/const";
import LongFormNote from "./LongFormNote";
import List from "@habla/components/nostr/List";
import Badge from "../Badge";

export default function Address({
  naddr,
  kind,
  identifier,
  pubkey,
  relays,
  ...props
}) {
  const event = useEvent({
    kinds: [kind],
    "#d": [identifier],
    authors: [pubkey],
  });

  if (event && (kind === LONG_FORM || kind === LONG_FORM_DRAFT)) {
    return <LongFormNote event={event} relays={relays} {...props} />;
  }

  if (event && kind === BADGE) {
    return <Badge event={event} relays={relays} {...props} />;
  }

  if (event && LISTS.includes(kind)) {
    return <List event={event} />;
  }

  return <code>{JSON.stringify(event, null, 2)}</code>;
}
