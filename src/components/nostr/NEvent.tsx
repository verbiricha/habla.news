import { useAtomValue } from "jotai";

import Event from "@habla/components/Event";
import { useEvent } from "@habla/nostr/hooks";
import { relaysAtom } from "@habla/state";

export default function NEvent({ id, author, relays, nevent }) {
  const defaultRelays = useAtomValue(relaysAtom);
  const event = useEvent(
    {
      ids: [id],
      authors: [author],
    },
    { relays: relays.concat(defaultRelays) }
  );
  return event ? <Event event={event} /> : null;
}
