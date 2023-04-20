import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";

import RelayFavicon from "../components/RelayFavicon";

export default function NRelay({ url, nrelay }) {
  return (
    <Flex alignItems="center" gap="2">
      <RelayFavicon url={url} />
      <Link href={`/r/${nrelay}`}>
        <Text fontSize="md">{url}</Text>
      </Link>
    </Flex>
  );
}
