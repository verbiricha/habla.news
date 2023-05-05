import Link from "next/link";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import { Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { shortenString } from "@habla/format";
import { useUser } from "@habla/nostr/hooks";

export default function Username({ pubkey, renderLink, ...rest }) {
  const [relays] = useAtom(relaysAtom);
  const user = useUser(pubkey);
  const username = (
    <Text fontFamily="Inter" {...rest}>
      {user?.name || shortenString(pubkey, 8)}
    </Text>
  );
  return renderLink ? (
    <Link href={`/p/${nip19.nprofileEncode({ pubkey, relays })}`}>
      {username}
    </Link>
  ) : (
    username
  );
}
