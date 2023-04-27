import { useState, useEffect } from "react";

import { NOTE } from "@habla/const";
import { useEvents } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Note from "@habla/components/nostr/Note";

export default function Comments({ event }) {
  const { identifier } = getMetadata(event);
  const filter = {
    kinds: [NOTE],
    "#a": [`${event.kind}:${event.pubkey}:${identifier}`],
  };
  const { events } = useEvents(filter);

  return (
    <>
      {events.map((event, idx) => (
        <Note key={event.id} event={event} />
      ))}
    </>
  );
}
