import { useRouter } from "next/router";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";
import { Flex, Stack, Text } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { useUser } from "@habla/nostr/hooks";
import { UserAvatar } from "@habla/components/nostr/Avatar";
import { shortenString } from "@habla/format";
import { getHandle } from "@habla/nip05";
import { useNostrAddress } from "@habla/hooks/useNostrAddress";

function NostrAddress({ pubkey, nip05, isVerified }) {
  return (
    <Text fontSize="2xs" color="secondary">
      {nip05.startsWith("_@") ? nip05.slice(2) : nip05}
    </Text>
  );
}

export default function User({
  pubkey,
  flex,
  flexWrap = "wrap",
  showAvatar = true,
  showNostrAddress = false,
  showBio = false,
  size = "sm",
  ...rest
}) {
  const [relays] = useAtom(relaysAtom);
  const router = useRouter();
  const user = useUser(pubkey);
  const handle = getHandle(pubkey);
  const { data } = useNostrAddress(user?.nip05);
  const isVerified = data?.pubkey === pubkey;
  const url = handle
    ? `/${handle}`
    : user?.nip05 && isVerified
    ? `/u/${user.nip05}`
    : `/p/${nip19.nprofileEncode({ pubkey, relays })}`;
  const username = (
    <Text as="span" fontFamily="Inter" {...rest}>
      {user?.name || shortenString(pubkey, 6)}
    </Text>
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
      {showAvatar && <UserAvatar size={size} user={user} pubkey={pubkey} />}
      <Stack gap={0}>
        {username}
        {showNostrAddress && isVerified && (
          <NostrAddress pubkey={pubkey} nip05={user.nip05} />
        )}
        {showBio && user?.about && (
          <Text fontFamily="Inter" fontSize="sm" color="secondary" mt={1}>
            {user?.about}
          </Text>
        )}
      </Stack>
    </Flex>
  );
}
