import { useRouter } from "next/router";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";
import { Flex, Stack, Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { useUser } from "@habla/nostr/hooks";
import { UserAvatar } from "@habla/components/nostr/Avatar";
import { shortenString } from "@habla/format";
import { getHandle } from "@habla/nip05";

export default function User({
  pubkey,
  flex,
  flexWrap = "wrap",
  showBio,
  size = "sm",
  ...rest
}) {
  const [relays] = useAtom(relaysAtom);
  const router = useRouter();
  const user = useUser(pubkey);
  const handle = getHandle(pubkey);
  const url = handle
    ? `/${handle}`
    : user?.nip05
    ? `/u/${user.nip05}`
    : `/p/${nip19.nprofileEncode({ pubkey, relays })}`;
  const username = (
    <Text fontFamily="Inter">{user?.name || shortenString(pubkey, 6)}</Text>
  );
  return (
    <Flex
      gap="2"
      alignItems={showBio ? "flex-start" : "center"}
      cursor="pointer"
      wordBreak="break-word"
      flex={flex}
      flexWrap={flexWrap}
      onClick={() => router.push(url, undefined, { shallow: true })}
      {...rest}
    >
      <UserAvatar size={size} user={user} pubkey={pubkey} />
      {showBio && user?.about ? (
        <Stack>
          {username}
          <Text fontFamily="Inter" fontSize="sm" color="secondary">
            {user?.about}
          </Text>
        </Stack>
      ) : (
        username
      )}
    </Flex>
  );
}
