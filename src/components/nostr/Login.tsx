import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { NDKUser, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useAtom } from "jotai";
import { nip05, nip19 } from "nostr-tools";

import {
  useDisclosure,
  useColorModeValue,
  useToast,
  Flex,
  Button,
  Heading,
  Text,
  Icon,
  Input,
  Divider,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { CONTACTS } from "@habla/const";
import WriteIcon from "@habla/icons/Write";
import ExternalLink from "@habla/components/ExternalLink";
import { useNdk } from "@habla/nostr/hooks";
import Avatar from "@habla/components/nostr/Avatar";
import { userAtom, relaysAtom, pubkeyAtom, followsAtom } from "@habla/state";

function LoginModal({ isOpen, onClose }) {
  const ndk = useNdk();
  const [pubkeyLike, setPubkeyLike] = useState();
  const toast = useToast();
  const [, setPubkey] = useAtom(pubkeyAtom);

  async function loginWithPubkey() {
    try {
      if (pubkeyLike.startsWith("npub")) {
        const decoded = nip19.decode(pubkeyLike);
        if (decoded.type === "npub") {
          setPubkey(decoded.data);
        }
      } else {
        const profile = await nip05.queryProfile(pubkeyLike);
        if (profile) {
          setPubkey(profile.pubkey);
          if (profile.relays.lenght) {
            setRelays(profile.relays);
          }
        }
      }
      onClose();
    } catch (error) {
      toast({
        title: "Could not sign in",
        status: "error",
        description: error.message,
      });
      console.error(error);
    }
  }

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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack mb={5} gap={3}>
              <Heading fontSize="lg">Nostr extension</Heading>
              <Text>
                Use a Nostr extension such as{" "}
                <ExternalLink href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp">
                  nos2x
                </ExternalLink>{" "}
                or <ExternalLink href="https://getalby.com/">Alby</ExternalLink>{" "}
                for logging in. This is the recommended method.
              </Text>
              <Button
                maxW="12rem"
                colorScheme="orange"
                isDisabled={typeof window === "undefined" || !window.nostr}
                onClick={loginWithExtension}
              >
                Log In
              </Button>
              <Divider />
              <Heading fontSize="lg">Public key</Heading>
              <Text>Log in with a public key or nostr address. Read only.</Text>
              <Input
                placeholder="npub or nostr address (nip-05)"
                type="text"
                value={pubkeyLike}
                onChange={(e) => setPubkeyLike(e.target.value)}
              />
              <Button
                maxW="12rem"
                colorScheme="orange"
                isDisabled={!pubkeyLike}
                onClick={loginWithPubkey}
              >
                Log In
              </Button>
            </Stack>
            <Divider />
            <Stack my={5} gap={3}>
              <Heading fontSize="lg">Create account</Heading>
              <Text>
                We are working on this feature. In the meantime you can create a
                nostr account in{" "}
                <ExternalLink href="https://nosta.me/">Nosta</ExternalLink>.
              </Text>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

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
  const [relays, setRelays] = useAtom(relaysAtom);
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);
  const [, setFollows] = useAtom(followsAtom);
  const bg = useColorModeValue("black", "white");
  const fg = useColorModeValue("white", "black");
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          try {
            const relays = JSON.parse(contactList.content);
            setRelays(Object.keys(relays));
          } catch (error) {
            console.log("Relays not included in contact list");
          }
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
    <>
      <Button colorScheme="orange" onClick={onOpen}>
        Log in
      </Button>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
