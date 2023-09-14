import { useEvent } from "@habla/nostr/hooks";
import { COMMUNITY } from "@habla/const";

import Community from "@habla/components/nostr/Community";

export default function CommunityAddress({
  naddr,
  identifier,
  pubkey,
  relays,
  ...props
}) {
  const event = useEvent(
    {
      kinds: [COMMUNITY],
      "#d": [identifier],
      authors: [pubkey],
    },
    { cacheUsage: "PARALLEL" }
  );

  if (event) {
    return <Community event={event} />;
  }
  return null;
}
