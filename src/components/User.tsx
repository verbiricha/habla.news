import { useRouter } from "next/router";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";
import { Box, Flex, Stack, Avatar, Heading, Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { shortenString } from "@habla/format";

export default function User({ pubkey, user, size = "sm", ...rest }) {
  const [relays] = useAtom(relaysAtom);
  const router = useRouter();
  return (
    <Flex
      gap="2"
      alignItems="center"
      flexWrap="wrap"
      cursor="pointer"
      onClick={() =>
        router.push(
          `/p/${nip19.nprofileEncode({ pubkey, relays })}`,
          undefined,
          { shallow: true }
        )
      }
      {...rest}
    >
      <Avatar
        name={user.name || pubkey}
        size={size}
        src={user.picture || user.image}
      />

      <Text>{user.name || shortenString(pubkey, 8)}</Text>
    </Flex>
  );
}
