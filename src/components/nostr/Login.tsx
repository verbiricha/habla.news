import { useEffect, useMemo } from "react";
import Link from "next/link";
import { NDKUser, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import {
  useColorModeValue,
  useToast,
  Flex,
  Button,
  Text,
  Icon,
  Stack,
} from "@chakra-ui/react";

import { CONTACTS } from "@habla/const";
import WriteIcon from "@habla/icons/Write";
import { useNdk } from "@habla/nostr/hooks";
import Avatar from "@habla/components/nostr/Avatar";
import { userAtom, relaysAtom, pubkeyAtom, followsAtom } from "@habla/state";

function ProfileLink({ pubkey, relays }) {
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
      <Avatar size="md" pubkey={pubkey} />
    </Link>
  );
}

export default function Login() {
  const ndk = useNdk();
  const toast = useToast();
  const [relays, setRelays] = useAtom(relaysAtom);
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);
  const [, setFollows] = useAtom(followsAtom);
  const bg = useColorModeValue("black", "white");
  const fg = useColorModeValue("white", "black");

  function loginWithExtension() {
    try {
      const signer = new NDKNip07Signer();
      ndk.signer = signer;
      signer.user().then((user) => {
        user.ndk = ndk;
        setPubkey(user.hexpubkey());
        // User profile
        user.fetchProfile();
      });
    } catch (error) {
      toast({
        title: "Could not sign in",
        status: "error",
        description: error.message,
      });
      console.error(error);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      loginWithExtension();
    }
  }, []);

  useEffect(() => {
    if (pubkey) {
      // Follows & Relays
      ndk
        .fetchEvent({
          kinds: [CONTACTS],
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

  return pubkey ? (
    <Stack align="center" direction="row" spacing={2}>
      <Link href="/write">
        <Button
          variant="write"
          aria-label="Write"
          bg={bg}
          color={fg}
          leftIcon={<Icon as={WriteIcon} boxSize={5} />}
        >
          Write
        </Button>
      </Link>
      <ProfileLink pubkey={pubkey} relays={relays} />
    </Stack>
  ) : (
    <Button colorScheme="orange" onClick={loginWithExtension}>
      Log in
    </Button>
  );
}
