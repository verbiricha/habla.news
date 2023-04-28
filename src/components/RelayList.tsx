import { useState } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { Flex, Text } from "@chakra-ui/react";

import RelayFavicon from "./RelayFavicon";

function sorted(s: Set<any>) {
  const sorted = Array.from(s);
  sorted.sort();
  return sorted;
}

export default function RelayList({
  relays,
  linkToNrelay = false,
  showUrl = false,
  ...props
}) {
  const urls = relays ? sorted(relays) : [];
  return (
    <Flex flexWrap="wrap" {...props}>
      {urls.map((url) => {
        return (
          <Link key={url} href={`/r/${nip19.nrelayEncode(url)}`}>
            <RelayFavicon url={url} ml={-1} mb={2} />
          </Link>
        );
      })}
    </Flex>
  );
}
