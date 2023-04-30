import { useEffect, useMemo } from "react";
import Link from "next/link";
import { NDKUser } from "@nostr-dev-kit/ndk";

import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { useNdk, useUser } from "@habla/nostr/hooks";
import { Avatar, Flex, Button, Text } from "@chakra-ui/react";

import { userAtom, relaysAtom, pubkeyAtom, followsAtom } from "@habla/state";

function ProfileLink({ pubkey, relays }) {
  const profile = useUser(pubkey);
  const nprofile = useMemo(() => {
    if (pubkey) {
      return nip19.nprofileEncode({
        pubkey,
        relays,
      });
    }
  }, [pubkey, relays]);

  return (
    <Link href={`/p/${nprofile}`}>
      <Flex gap="2" ml="auto">
        <Avatar
          name={profile?.display_name || profile?.name || profile?.npub}
          size="xs"
          src={profile?.picture || profile?.image}
        />
        <Text fontSize="sm">{profile?.display_name || profile?.name}</Text>
      </Flex>
    </Link>
  );
}

export default function Login() {
  const ndk = useNdk();
  const [relays, setRelays] = useAtom(relaysAtom);
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);
  const [, setFollows] = useAtom(followsAtom);

  function loginWithExtension() {
    try {
      window.nostr.getPublicKey().then(async (pk) => {
        setPubkey(pk);
        const user = new NDKUser({ hexpubkey: pk });
        user.ndk = ndk;
        // User profile
        user.fetchProfile();
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!pubkey) {
      loginWithExtension();
    }
  }, [pubkey]);

  useEffect(() => {
    if (pubkey) {
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
  }, [pubkey]);

  return pubkey ? <ProfileLink pubkey={pubkey} relays={relays} /> : null;
}
