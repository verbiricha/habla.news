import { useMemo } from "react";
import Link from "next/link";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import { Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { shortenString } from "@habla/format";
import { useUser } from "@habla/nostr/hooks";
import Emoji from "@habla/components/Emoji";

export default function Username({ pubkey, renderLink, ...rest }) {
  const [relays] = useAtom(relaysAtom);
  const user = useUser(pubkey);
  const emoji =
    user?.emoji?.reduce((acc, t) => {
      return { ...acc, [t.at(1)]: t.at(2) };
    }, {}) ?? {};
  const emojified = useMemo(() => {
    if (!user?.name) {
      return;
    }
    let result = user.name || user.display_name;
    //todo: support multiple emoji
    for (const e of Object.keys(emoji)) {
      const img = emoji[e];
      const splitted = result.split(`:${e}:`);
      if (splitted.length > 1) {
        result = splitted.reduce((acc, val) =>
          [].concat(acc, <Emoji src={img} boxSize={3} />, val)
        );
        break;
      }
    }
    return result;
  }, [user, emoji]);
  return renderLink ? (
    <Link
      href={
        user.nip05
          ? `/u/${user.nip05}`
          : `/p/${nip19.nprofileEncode({ pubkey, relays })}`
      }
    >
      {emojified || shortenString(pubkey, 8)}
    </Link>
  ) : (
    emojified || shortenString(pubkey, 8)
  );
}
