import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { findTag } from "@habla/tags";

export function getMetadata(ev: NDKEvent) {
  return {
    name: findTag(ev, "d") || "",
    description: findTag(ev, "description") || "",
    image: findTag(ev, "image"),
    rules: findTag(ev, "rules") || "",
  };
}
