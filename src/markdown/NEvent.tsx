import { Spinner } from "@chakra-ui/react";

import { useEvent } from "@habla/nostr/hooks";
import Event from "@habla/components/nostr/Event";

export default function NEvent({ nevent, id, relays }) {
  const event = useEvent({ ids: [id] }, { relays });
  return event ? <Event event={event} isFeed /> : <Spinner />;
}
