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
        const content = (
          <Flex alignItems="center">
            <RelayFavicon url={url} ml={-1} mb={2} size="xs" margin ={0.5}/>
            {showUrl && (
              <Text
                margin={0}
                my={1}
                fontSize="md"
                color="purple.500"
                style={{ textDecoration: "none" }}
              >
                {url}
              </Text>
            )}
          </Flex>
        );
        return linkToNrelay ? (
          <Link key={url} href={`/r/${nip19.nrelayEncode(url)}`}>
            {content}
          </Link>
        ) : (
          content
        );
      })}
    </Flex>
  );
}
