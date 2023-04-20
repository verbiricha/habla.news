import { useState, useEffect } from "react";

import { Button } from "@chakra-ui/react";

import { useEvents } from "@habla/nostr/hooks";
import Event from "./feed/Event";

export default function Feed({ filter, options = { closeOnEose: false } }) {
  const { events } = useEvents(filter, options);

  return (
    <>
      {events.map((event, idx) => (
        <Event key={event.id} event={event} />
      ))}
    </>
  );
}
