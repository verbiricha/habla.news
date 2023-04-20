import { createContext } from "react";

import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";

const NostrContext = createContext<{ ndk: NDK }>({ ndk: () => null });

export default NostrContext;
