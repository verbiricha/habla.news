import { useMemo, useEffect } from "react";
import { AppProps } from "next/app";
import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { ChakraProvider } from "@chakra-ui/react";

import NostrContext from "@habla/nostr/provider";
import cacheAdapter from "@habla/cache/indexeddb";

import theme from "@habla/theme";
import { userAtom, relaysAtom, pubkeyAtom, followsAtom } from "@habla/state";
import { useNdk, useSigner } from "@habla/nostr";

function useNip07(ndk, signer) {
  const [user, setUser] = useAtom(userAtom);
  const [, setRelays] = useAtom(relaysAtom);
  const [, setPubkey] = useAtom(pubkeyAtom);
  const [, setFollows] = useAtom(followsAtom);

  useEffect(() => {
    try {
      signer?.user().then(async (user) => {
        if (user?.npub) {
          user.ndk = ndk;
          user.fetchProfile().then(() => {
            setUser(user);
            setPubkey(nip19.decode(user.npub).data);
          });
          user.follows().then((follows) => {
            setFollows(follows);
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (user?.npub) {
      try {
        const pubkey = nip19.decode(user.npub).data;
        ndk
          .fetchEvent({
            kinds: [3],
            authors: [pubkey],
          })
          .then((contactList) => {
            const relays = JSON.parse(contactList.content);
            setRelays(Object.keys(relays));
          });
        // NIP-65
        //ndk
        //  .fetchEvent({
        //    kinds: [10002],
        //    authors: [pubkey],
        //  })
        //  .then((relayMetadata) => {
        //    const relays = relayMetadata.tags
        //      .filter((t) => t.at(0) === "r")
        //      .map((t) => t.at(1));
        //    setRelays(relays);
        //  });
      } catch (error) {
        console.error(error);
      }
    }
  }, [user]);
}

function MyApp({ Component, pageProps }: AppProps) {
  const [explicitRelayUrls] = useAtom(relaysAtom);
  const signer = useSigner();
  const options =
    typeof window === "undefined"
      ? { explicitRelayUrls }
      : {
          explicitRelayUrls,
          cacheAdapter,
          signer,
        };
  const ndk = useNdk(options);
  useNip07(ndk, signer);
  return (
    <NostrContext.Provider value={{ ndk }}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </NostrContext.Provider>
  );
}

export default MyApp;
