import { useState, useEffect } from "react";

import { Button } from "@chakra-ui/react";

import { HIGHLIGHT } from "@habla/const";
import { useEvents } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Highlight from "@habla/components/nostr/feed/Highlight";

export default function Highlights({ event, relays }) {
  const { identifier } = getMetadata(event);
  const filter = {
    kinds: [HIGHLIGHT],
    "#a": [`${event.kind}:${event.pubkey}:${identifier}`],
  };
  const { events } = useEvents(filter, { relays });

  return (
    <>
      {events.map((event, idx) => (
        <Highlight key={event.id} event={event} showHeader={false} />
      ))}
    </>
  );
}
