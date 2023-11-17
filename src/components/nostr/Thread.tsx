import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";
import { Box } from "@chakra-ui/react";
import { ZapThreadsAttributes } from "zapthreads";
import "zapthreads";

import { pubkeyAtom, relaysAtom } from "@habla/state";
import { useMemo } from "react";

export default function Thread({ anchor }) {
  const [loggedInPubkey] = useAtom(pubkeyAtom);
  const [defaultRelays] = useAtom(relaysAtom);
  const npub = useMemo(() => {
    return loggedInPubkey ? nip19.npubEncode(loggedInPubkey) : "";
  }, [loggedInPubkey]);

  return (
    <Box maxW="92vw">
      <zap-threads
        anchor={anchor}
        user={npub}
        relays={defaultRelays.join(',')}
        disable="likes,zaps"
        urls="naddr:habla.news/a/,npub:habla.news/p/,nprofile:habla.news/p/,nevent:habla.news/e/,note:habla.news/n/,tag:habla.news/t/"
      />
    </Box>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "zap-threads": ZapThreadsAttributes;
    }
  }
}
