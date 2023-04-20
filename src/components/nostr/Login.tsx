import { useMemo } from "react";
import Link from "next/link";

import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { Avatar, Flex, Button, Text } from "@chakra-ui/react";

import { userAtom, relaysAtom } from "@habla/state";

export default function Login() {
  const [user] = useAtom(userAtom);
  const [relays] = useAtom(relaysAtom);
  const { profile } = user ? user : {};

  const nprofile = useMemo(() => {
    if (user) {
      return nip19.nprofileEncode({
        pubkey: nip19.decode(user.npub).data,
        relays,
      });
    }
  }, [user, relays]);

  return (
    <Flex width="120px">
      {user ? (
        <Link href={`/p/${nprofile}`}>
          <Flex gap="2" ml="auto">
            <Avatar
              name={
                profile?.display_name ||
                profile?.displayName ||
                profile?.name ||
                profile?.npub
              }
              size="xs"
              src={profile?.picture || profile?.image}
            />
            <Text fontSize="sm">{profile?.display_name || profile?.name}</Text>
          </Flex>
        </Link>
      ) : (
        <Button colorScheme="purple">Get started</Button>
      )}
    </Flex>
  );
}
