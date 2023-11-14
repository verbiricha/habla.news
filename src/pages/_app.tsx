import "@fontsource/unbounded/400.css";
import "@fontsource/unbounded/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/source-serif-pro/400.css";

import { useMemo } from "react";
import { appWithTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { Provider, useAtomValue } from "jotai";

import { createLocalStorageManager, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import NostrContext from "@habla/nostr/provider";

import theme from "@habla/theme";
import { relaysAtom } from "@habla/state";
import { createNdk } from "@habla/nostr";
import cacheAdapter from "@habla/cache/dexie";

// this changes the default local storage key name to ensure that no user has light mode cached in
const colorModeManager = createLocalStorageManager("habla-ui-color");

// react-query client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const explicitRelayUrls = useAtomValue(relaysAtom);
  const options =
    typeof window === "undefined"
      ? {
          autoConnectUserRelays: false,
          blacklistRelayUrls: ["wss://brb.io", "wss://brb.io/"],
          explicitRelayUrls,
        }
      : {
          autoConnectUserRelays: false,
          blacklistRelayUrls: ["wss://brb.io", "wss://brb.io/"],
          explicitRelayUrls,
          cacheAdapter,
        };

  const ndk = useMemo(() => {
    return createNdk(options);
  }, []);

  return (
    <NostrContext.Provider value={{ ndk }}>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </QueryClientProvider>
      </ChakraProvider>
    </NostrContext.Provider>
  );
}

export default appWithTranslation(MyApp);
