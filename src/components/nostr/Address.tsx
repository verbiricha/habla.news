import { useEvent, useReactions } from "@habla/nostr/hooks";
import {
  LONG_FORM,
  LONG_FORM_DRAFT,
  ZAP,
  ZAPSTR_TRACK,
  APP,
  //APP_RECOMMENDATION,
  HIGHLIGHT,
  BADGE,
  LISTS,
  LIVE_EVENT,
  COMMUNITY,
} from "@habla/const";

import LongFormNote from "./LongFormNote";
import Feed from "./Feed";
import List from "./List";
import Badge from "./Badge";
import ZapstrTrack from "./ZapstrTrack";
import Community from "./Community";
import App from "./App";
import AppReccomendation from "./AppReccomendation";
import UnknownKind from "./UnknownKind";

export default function Address({
  naddr,
  kind,
  identifier,
  pubkey,
  relays,
  ...props
}) {
  const event = useEvent(
    {
      kinds: [kind],
      "#d": [identifier],
      authors: [pubkey],
    },
    { cacheUsage: "PARALLEL" }
  );

  if (event && (kind === LONG_FORM || kind === LONG_FORM_DRAFT)) {
    return <LongFormNote event={event} relays={relays} {...props} />;
  }

  if (event && LISTS.includes(kind)) {
    return <List event={event} />;
  }
  if (event && kind === COMMUNITY) {
    return <Community event={event} />;
  }
  if (event?.kind === BADGE) {
    return <Badge event={event} />;
  }
  if (event?.kind === ZAPSTR_TRACK) {
    return <ZapstrTrack event={event} />;
  }
  if (event?.kind === APP) {
    return <App event={event} />;
  }
  //if (event?.kind === APP_RECOMMENDATION) {
  //  return <AppReccomendation event={event} />;
  //}

  return event ? <UnknownKind event={event} /> : null;
}
