import { useMemo } from "react";

import { findTags } from "@habla/tags";

export default function useHashtags(event) {
  const hashtags = useMemo(() => {
    return findTags(event, "t");
  }, [event]);
  return hashtags;
}
