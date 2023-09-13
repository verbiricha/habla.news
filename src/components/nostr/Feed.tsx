import { useState, useEffect } from "react";

import { Button } from "@chakra-ui/react";

import { useEvents } from "@habla/nostr/hooks";
import Events from "./feed/Events";

export default function Feed({ filter, options = { closeOnEose: false } }) {
  const { events } = useEvents(filter, options);
  return <Events events={events} />;
}
