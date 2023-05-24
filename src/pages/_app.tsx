import "@fontsource/unbounded/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/source-serif-pro/400.css";

import { useMemo, useEffect } from "react";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { createLocalStorageManager, ChakraProvider } from "@chakra-ui/react";

import NostrContext from "@habla/nostr/provider";
import cacheAdapter from "@habla/cache/indexeddb";

import theme from "@habla/theme";
import { userAtom, relaysAtom, pubkeyAtom, followsAtom } from "@habla/state";
import { useNdk } from "@habla/nostr";

// this changes the default local storage key name to ensure that no user has light mode cached in
const colorModeManager = createLocalStorageManager("habla-ui-color");

function MyApp({ Component, pageProps }: AppProps) {
  const [explicitRelayUrls] = useAtom(relaysAtom);
  const options =
    typeof window === "undefined"
      ? { explicitRelayUrls }
      : {
          explicitRelayUrls,
          cacheAdapter,
        };
  const ndk = useNdk(options);
  return (
    <NostrContext.Provider value={{ ndk }}>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <Component {...pageProps} />
      </ChakraProvider>
    </NostrContext.Provider>
  );
}

export default appWithTranslation(MyApp);
