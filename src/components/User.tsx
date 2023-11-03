import { useRouter } from "next/router";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";
import { Box, Flex, Stack, Avatar, Heading, Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { shortenString } from "@habla/format";
import { getHandle } from "@habla/nip05";

export default function User({
  pubkey,
  user,
  size = "sm",
  includeUsername = true,
  ...rest
}) {
  const [relays] = useAtom(relaysAtom);
  const router = useRouter();
  const handle = getHandle(pubkey);
  const url = handle
    ? `/${handle}`
    : user?.nip05
    ? `/u/${user.nip05}`
    : `/p/${nip19.nprofileEncode({ pubkey, relays })}`;
  return (
    <Flex
      gap="2"
      alignItems="center"
      flexWrap="wrap"
      cursor="pointer"
      onClick={() => router.push(url, undefined, { shallow: true })}
      {...rest}
    >
      <Avatar
        name={user.name || pubkey}
        size={size}
        src={user.picture || user.image}
      />

      {includeUsername && (
        <Text fontFamily="Inter">{user.name || shortenString(pubkey, 8)}</Text>
      )}
    </Flex>
  );
}
