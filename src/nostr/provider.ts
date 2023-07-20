import { createContext } from "react";

import NDK, { NDKEvent, NDKSigner } from "@nostr-dev-kit/ndk";

const NostrContext = createContext<{ ndk: NDK; signer: NDKSigner }>({
  ndk: () => null,
  signer: () => null,
});

export default NostrContext;
