import { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";

import RelayFavicon from "./RelayFavicon";
import RelayLink from "./RelayLink";

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
          <RelayLink url={url}>
            <RelayFavicon
              url={url}
              mr={-1}
              sx={{ filter: "grayscale(.6)", ":hover": { filter: "none" } }}
            />
          </RelayLink>
        );
      })}
    </Flex>
  );
}
