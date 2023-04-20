import { NDKEvent } from "@nostr-dev-kit/ndk";

import { findTag } from "@habla/tags";

export function getBadge(event: NDKEvent) {
  const name = findTag(event, "name");
  const description = findTag(event, "description");
  const image = findTag(event, "image");
  const thumb = findTag(event, "thumb");
  return { name, description, image: image || thumb };
}
