import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { REPOST } from "@habla/const";
import { dateToUnix } from "@habla/time";
import { pubkeyAtom } from "@habla/state";
import useSeenOn from "@habla/hooks/useSeenOn";
import RepostIcon from "@habla/icons/Repost";
import ReactionCount from "@habla/components/reactions/ReactionCount";
import { useNdk } from "@habla/nostr/hooks";

export default function Reposts({ event, reposts }) {
  const ndk = useNdk();
  const toast = useToast();
  const [pubkey] = useAtom(pubkeyAtom);
  const seenOn = useSeenOn(event);
  const reposted = reposts.some((r) => r.pubkey === pubkey);

  async function onRepost() {
    const rawEvent = await event.toNostrEvent();

    const ref = event.tagReference();
    const evTags = event.tags.filter((t) => ["e", "a", "p"].includes(t.at(0)));
    const relay = seenOn.at(0);
    const tag = relay ? [...ref, relay] : ref;
    const p = ["p", event.pubkey];

    try {
      const ev = {
        kind: REPOST,
        created_at: dateToUnix(),
        tags: [tag, p, ...evTags],
        content: JSON.stringify(rawEvent),
      };
      const signed = new NDKEvent(ndk, ev);
      await signed.sign();
      await ndk.publish(signed);
      toast({
        status: "success",
        title: "♻️ Reposted",
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Could not repost",
        description: error.message,
      });
    }
  }

  return (
    <ReactionCount
      cursor="pointer"
      color={reposted ? "highlight" : "secondary"}
      icon={RepostIcon}
      reactions={reposts}
      onClick={onRepost}
    />
  );
}
