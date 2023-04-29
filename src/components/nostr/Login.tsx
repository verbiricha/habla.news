import { useEffect, useMemo } from "react";
import Link from "next/link";
import { NDKNip07Signer } from "@nostr-dev-kit/ndk";

import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { Avatar, Flex, Button, Text } from "@chakra-ui/react";

import { userAtom, relaysAtom, pubkeyAtom, followsAtom } from "@habla/state";

export default function Login() {
  const [user, setUser] = useAtom(userAtom);
  const [relays, setRelays] = useAtom(relaysAtom);
  const [, setPubkey] = useAtom(pubkeyAtom);
  const [, setFollows] = useAtom(followsAtom);
  const { profile } = user ? user : {};

  function loginWithNostr() {
    try {
      const signer = new NDKNip07Signer();
      signer?.user().then(async (user) => {
        if (user?.npub) {
          const pubkey = nip19.decode(user.npub).data;
          user.ndk = ndk;

          // User profile
          user.fetchProfile().then(() => {
            setUser(user);
            setPubkey(nip19.decode(user.npub).data);
          });
          // Follows & Relays
          ndk
            .fetchEvent({
              kinds: [3],
              authors: [pubkey],
            })
            .then((contactList) => {
              const follows = contactList.tags
                .filter((t) => t.at(0) === "p")
                .map((t) => t.at(1));
              setFollows(follows);
              const relays = JSON.parse(contactList.content);
              setRelays(Object.keys(relays));
            });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

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
        <Button colorScheme="purple" onClick={loginWithNostr}>
          Get started
        </Button>
      )}
    </Flex>
  );
}
