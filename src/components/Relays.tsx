import { useState } from "react";
import Link from "next/link";

import {
  Flex,
  Stack,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import { relaysAtom } from "@habla/state";

import RelayFavicon from "./RelayFavicon";

function RelayCard({ url }) {
  return (
    <Flex alignItems="center" gap="2">
      <RelayFavicon url={url} />
      <Link href={`/r/${nip19.nrelayEncode(url)}`}>
        <Heading fontSize="md">{url}</Heading>
      </Link>
    </Flex>
  );
}

export default function Relays() {
  const [relays] = useAtom(relaysAtom);
  return (
    <Stack spacing="4">
      {relays.map((url) => (
        <RelayCard key={url} url={url} />
      ))}
    </Stack>
  );
}
