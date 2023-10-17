import { Stack } from "@chakra-ui/react";

import Event from "@habla/components/nostr/feed/Event";

export default function Events({ events }) {
  return (
    <Stack gap={4}>
      {events.map((event, idx) => (
        <Event key={event.id} event={event} />
      ))}
    </Stack>
  );
}
