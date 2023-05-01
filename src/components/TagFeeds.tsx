import { useState, useMemo } from "react";
import { Heading } from "@chakra-ui/react";

import { LONG_FORM } from "@habla/const";
import Feed from "@habla/components/nostr/Feed";

export default function TagFeeds({ tag }) {
  return (
    <>
      <Heading>Tag: #{tag}</Heading>
      <Feed
        filter={{ kinds: [LONG_FORM], "#t": [tag] }}
        options={{ cacheUsage: "PARALLEL", closeOnEose: true }}
      />
    </>
  );
}
