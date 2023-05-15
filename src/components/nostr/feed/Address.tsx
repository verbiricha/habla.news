import { useEvent, useReactions } from "@habla/nostr/hooks";
import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  BADGE,
  REACTION,
  LISTS,
  ZAPSTR_TRACK,
} from "@habla/const";
import LongFormNote from "./LongFormNote";
import List from "@habla/components/nostr/List";
import Badge from "../Badge";
import ZapstrTrack from "../ZapstrTrack";

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

  if (event && kind === ZAPSTR_TRACK) {
    return <ZapstrTrack event={event} />;
  }

  return event ? <code>{event.content}</code> : null;
}
