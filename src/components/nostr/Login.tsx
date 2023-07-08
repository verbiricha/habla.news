import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "next-i18next";
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
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

import { BOOKMARKS, PEOPLE, CONTACTS, RELAYS } from "@habla/const";
import WriteIcon from "@habla/icons/Write";
import ExternalLink from "@habla/components/ExternalLink";
import { useNdk } from "@habla/nostr/hooks";
import Avatar from "@habla/components/nostr/Avatar";
import {
  relaysAtom,
  pubkeyAtom,
  followsAtom,
  bookmarksAtom,
  peopleListsAtom,
} from "@habla/state";
import { findTag } from "@habla/tags";

function LoginModal({ isOpen, onClose }) {
  const ndk = useNdk();
  const [pubkeyLike, setPubkeyLike] = useState();
  const toast = useToast();
  const [, setPubkey] = useAtom(pubkeyAtom);
  const { t } = useTranslation("common");

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
          if (profile.relays?.length) {
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
        <ModalContent dir="auto">
          <ModalHeader>{t("log-in")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack mb={5}>
              <Heading fontSize="lg" mb={2}>
                {t("extension")}
              </Heading>
              <Text>{t("extension-descr")}</Text>
              <UnorderedList pl={6}>
                <ListItem>
                  <ExternalLink href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp">
                    nos2x
                  </ExternalLink>
                </ListItem>
                <ListItem>
                  <ExternalLink href="https://getalby.com/">Alby</ExternalLink>
                </ListItem>
              </UnorderedList>
              <Button
                maxW="12rem"
                colorScheme="orange"
                isDisabled={typeof window === "undefined" || !window.nostr}
                onClick={loginWithExtension}
              >
                {t("log-in")}
              </Button>
            </Stack>
            <Divider />
            <Stack my={4} gap={2}>
              <Heading fontSize="lg" mb={2}>
                {t("public-key")}
              </Heading>
              <Text>{t("public-key-descr")}</Text>
              <Input
                fontFamily="'Inter'"
                size="sm"
                placeholder={t("public-key-placeholder")}
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
                {t("log-in")}
              </Button>
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
  const [, setBookmarks] = useAtom(bookmarksAtom);
  const [, setPeopleLists] = useAtom(peopleListsAtom);
  const bg = useColorModeValue("black", "white");
  const fg = useColorModeValue("white", "black");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      pubkey &&
      !ndk.signer &&
      window.nostr
    ) {
      try {
        const signer = new NDKNip07Signer();
        ndk.signer = signer;
      } catch (error) {
        toast({
          title: "Could not sign in",
          status: "error",
          description: error.message,
        });
        console.error(error);
      }
    }
  }, [pubkey]);

  useEffect(() => {
    if (pubkey) {
      // Follows
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
        });
      // Communities
      ndk
        .fetchEvent({
          kinds: [BOOKMARKS],
          authors: [pubkey],
          "#d": ["communities"],
        })
        .then((communities) => {
          if (communities) {
            setBookmarks((_bs) =>
              communities.tags.filter((t) => t.at(0) === "a")
            );
          }
        });
      // People lists
      ndk
        .fetchEvents({
          kinds: [PEOPLE],
          authors: [pubkey],
        })
        .then((people) => {
          const peopleLists = Array.from(people).filter((p) => {
            const d = findTag(p, "d");
            const t = findTag(p, "t");
            const outdatedD = ["mute", "p:mute", "pin", "pinned"];
            // discard outdated pre nip-51 lists
            return !outdatedD.includes(d) && !outdatedD.includes(t);
          });
          setPeopleLists(peopleLists);
        });
      // Relays
      ndk
        .fetchEvent({
          kinds: [RELAYS],
          authors: [pubkey],
        })
        .then((relayMetadata) => {
          const relays = relayMetadata.tags.map((r) => r.at(1));
          setRelays(relays);
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
          {t("write")}
        </Button>
      </Link>
      <ProfileLink pubkey={pubkey} relays={relays} />
    </Stack>
  ) : (
    <>
      <Button colorScheme="orange" onClick={onOpen}>
        {t("log-in")}
      </Button>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
