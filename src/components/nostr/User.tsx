import { useRouter } from "next/router";

import { nip19 } from "nostr-tools";
import { Box, Flex, Stack, Avatar, Heading, Text } from "@chakra-ui/react";

import { shortenString } from "../../format";
import { useUser } from "../../nostr/hooks";

export default function User({ pubkey, size = "xs", relays = [], ...rest }) {
  const user = useUser(pubkey);
  const router = useRouter();
  return (
    <Flex
      gap="2"
      alignItems="center"
      flexWrap="wrap"
      cursor="pointer"
      onClick={() =>
        router.push(`/p/${nip19.nprofileEncode({ pubkey, relays })}`)
      }
      {...rest}
    >
      <Avatar
        name={user?.display_name || user?.name || pubkey}
        size={size}
        src={user?.picture || user?.image}
      />

      <Text>
        {user?.display_name ||
          user?.displayName ||
          user?.name ||
          shortenString(pubkey, 8)}
      </Text>
    </Flex>
  );
}
