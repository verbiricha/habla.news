import { useMemo } from "react";

import { NDKEvent } from "@nostr-dev-kit/ndk";

import { useNdk } from "@habla/nostr/hooks";
import Heart from "@habla/icons/Heart";
import ReactionCount from "@habla/components/reactions/ReactionCount";

export default function Reactions({ event, reactions }) {
  const ndk = useNdk();
  const likes = useMemo(
    () => reactions.filter((e) => e.content !== "-"),
    [reactions]
  );

  async function react() {
    try {
      const reaction = {
        kind: 7,
        content: "+",
        created_at: Math.floor(Date.now() / 1000),
        tags: [event.tagReference(), ["p", event.pubkey]],
      };
      const signed = await window.nostr.signEvent(reaction);
      const ndkEv = new NDKEvent(ndk, signed);
      ndk.publish(ndkEv);
    } catch (error) {
      console.error("Couldn't publish");
    }
  }

  return (
    <ReactionCount
      cursor="pointer"
      icon={Heart}
      reactions={likes}
      onClick={react}
    />
  );
}
