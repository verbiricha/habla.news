import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import {
  NostrEvent,
  NDKUser,
  NDKNip07Signer,
  NDKPrivateKeySigner,
  NDKSubscriptionCacheUsage,
} from "@nostr-dev-kit/ndk";
import { useAtom, useAtomValue } from "jotai";
import { nip05, nip19 } from "nostr-tools";

import {
  useDisclosure,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import {
  AtSignIcon,
  ChevronDownIcon,
  WarningIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";

import SettingsIcon from "@habla/icons/Settings";
import RelayIcon from "@habla/icons/Relay";
import WriteIcon from "@habla/icons/Write";
import ExternalLink from "@habla/components/ExternalLink";
import NewUser from "@habla/onboarding/NewUser";
import Avatar from "@habla/components/nostr/Avatar";
import { useEvents } from "@habla/nostr/hooks";
import {
  relaysAtom,
  sessionAtom,
  pubkeyAtom,
  privkeyAtom,
  contactListAtom,
  mutedAtom,
  privateMutedAtom,
  relayListAtom,
  communitiesAtom,
  peopleListsAtom,
  bookmarkListsAtom,
  bookmarksAtom,
  defaultRelays,
} from "@habla/state";
import { findTag } from "@habla/tags";
import { useIsOnboarding } from "@habla/onboarding/hooks";
import { useNdk } from "@habla/nostr/hooks";
import {
  PROFILE,
  PEOPLE,
  BOOKMARKS,
  CONTACTS,
  RELAYS,
  MUTED,
  COMMUNITIES,
  deprecatedPeopleLists,
  deprecatedBookmarkLists,
} from "@habla/const";

function LoginDialog({ isOpen, onClose }) {
  const ndk = useNdk();
  const { t } = useTranslation("common");
  const [pubkeyLike, setPubkeyLike] = useState();
  const [relays] = useAtom(relaysAtom);
  const toast = useToast();
  const [session, setSession] = useAtom(sessionAtom);

  async function loginWithPubkey() {
    try {
      // todo: nprofile support, store pubkey and relays
      if (pubkeyLike.startsWith("npub")) {
        const decoded = nip19.decode(pubkeyLike);
        if (decoded.type === "npub") {
          setSession({
            method: "pubkey",
            pubkey: decoded.data,
          });
        }
      } else {
        const profile = await nip05.queryProfile(pubkeyLike);
        if (profile) {
          setSession({
            method: "pubkey",
            pubkey: profile.pubkey,
          });
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
      signer.blockUntilReady().then((user) => {
        setSession({
          method: "nip7",
          pubkey: user.pubkey,
        });
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
      <Stack mb={5} gap={2}>
        <Heading fontSize="lg" mb={2}>
          {t("extension")}
        </Heading>
        <Text>{t("extension-descr")}</Text>
        <UnorderedList pl={6}>
          <ListItem>
            <ExternalLink href="https://getalby.com/">Alby</ExternalLink>
          </ListItem>
          <ListItem>
            <ExternalLink href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp">
              nos2x
            </ExternalLink>
          </ListItem>
        </UnorderedList>
        <Button
          maxW="12rem"
          colorScheme="orange"
          isDisabled={typeof window === "undefined" || !window.nostr}
          onClick={() => loginWithExtension(true)}
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
    </>
  );
}

type LoginModalFlow = "login" | "onboarding";

function LoginModal({ isOpen, onClose }) {
  const ndk = useNdk();
  const router = useRouter();
  const [flow, setFlow] = useState<LoginModalFlow | null>(null);
  const { t } = useTranslation("common");
  const onboardingModal = useDisclosure("onboarding");
  const [session, setSession] = useAtom(sessionAtom);
  const pubkey = useAtomValue(pubkeyAtom);

  function continueOnboarding() {
    closeModal();
    router.push("/onboarding");
  }

  function closeModal() {
    setFlow(null);
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent dir="auto">
          <ModalHeader>
            {!flow && t("get-started")}
            {flow === "login" && t("log-in")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {flow === null && (
              <Stack gap={4} mb={4}>
                <Stack gap={2}>
                  <Heading fontSize="lg" mb={2}>
                    {t("account")}
                  </Heading>
                  <Text>{t("account-descr")}</Text>
                  <Button onClick={() => setFlow("login")}>
                    {t("log-in")}
                  </Button>
                </Stack>

                <Stack gap={2}>
                  <Heading fontSize="lg" mb={2}>
                    {t("im-new")}
                  </Heading>
                  <Text>{t("im-new-descr")}</Text>
                  <Button onClick={() => setFlow("onboarding")}>
                    {t("create-account")}
                  </Button>
                </Stack>
              </Stack>
            )}

            {flow === "login" && (
              <LoginDialog isOpen={isOpen} onClose={closeModal} />
            )}
            {flow === "onboarding" && <NewUser onDone={continueOnboarding} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function ProfileMenu({ pubkey, relays, onClose }) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const router = useRouter();
  const isOnboarding = useIsOnboarding();
  const [session, setSession] = useAtom(sessionAtom);
  const [, setContactList] = useAtom(contactListAtom);
  const [, setPeopleLists] = useAtom(peopleListsAtom);
  const [, setBookmarkLists] = useAtom(bookmarkListsAtom);
  const [, setRelayList] = useAtom(relayListAtom);
  const nprofile = useMemo(() => {
    return nip19.nprofileEncode({
      pubkey,
      relays,
    });
  }, [pubkey, relays]);

  function logOut(ev) {
    setPeopleLists({});
    setBookmarkLists({});
    setContactList(null);
    setRelayList(null);
    setSession(null);
    ndk.signer = undefined;
    onClose();
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Avatar size="sm" pubkey={pubkey} />
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<AtSignIcon />}
          onClick={() =>
            isOnboarding
              ? router.push(`/onboarding`, undefined, { shallow: true })
              : router.push(`/p/${nprofile}`, undefined, { shallow: true })
          }
        >
          {t("profile")}
        </MenuItem>
        <MenuItem
          icon={<Icon as={SettingsIcon} boxSize={3} />}
          onClick={() => router.push(`/settings`, undefined, { shallow: true })}
        >
          {t("settings")}
        </MenuItem>
        <MenuItem
          icon={<Icon as={RelayIcon} boxSize={3} />}
          onClick={() => router.push(`/relays`, undefined, { shallow: true })}
        >
          {t("relays")}
        </MenuItem>
        <MenuItem
          icon={<ViewOffIcon />}
          onClick={() =>
            router.push(`/moderation`, undefined, { shallow: true })
          }
        >
          {t("moderation")}
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<WarningIcon />} onClick={logOut}>
          {t("logout")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function useFetchUserEvents(pubkey: string, isLoggedIn: boolean) {
  const ndk = useNdk();
  const [contacts, setContactList] = useAtom(contactListAtom);
  const [muted, setMuted] = useAtom(mutedAtom);
  const [privateMuted, setPrivateMuted] = useAtom(privateMutedAtom);
  const [relayList, setRelayList] = useAtom(relayListAtom);
  const [communities, setCommunities] = useAtom(communitiesAtom);
  const [peopleLists, setPeopleLists] = useAtom(peopleListsAtom);
  const [bookmarkLists, setBookmarkLists] = useAtom(bookmarkListsAtom);
  const [generalBookmarks, setGeneralBookmarks] = useAtom(bookmarksAtom);
  const { events } = useEvents(
    {
      kinds: [CONTACTS, RELAYS, MUTED, PEOPLE, BOOKMARKS, COMMUNITIES],
      authors: [pubkey],
    },
    {
      disable: !isLoggedIn,
      groupable: false,
      cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
      closeOnEose: false,
    }
  );

  async function decryptMuteList(ev: NostrEvent) {
    if (ev.content.length === 0) {
      return;
    }
    try {
      const user = await ndk.signer.user();
      const decrypted = await ndk.signer.decrypt(user, ev.content);
      setPrivateMuted(JSON.parse(decrypted));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    for (const event of events) {
      const nostrEvent = event.rawEvent();
      if (event.kind === CONTACTS) {
        const lastSeen = contacts?.created_at ?? 0;
        if (nostrEvent.created_at > lastSeen) {
          setContactList(nostrEvent);
        }
      }
      if (event.kind === RELAYS) {
        const relays = nostrEvent.tags.map((r) => r.at(1));
        const lastSeen = relayList?.created_at ?? 0;
        if (nostrEvent.created_at > lastSeen) {
          setRelayList(nostrEvent);
        }
      }
      if (event.kind === MUTED) {
        const lastSeen = muted?.created_at ?? 0;
        if (nostrEvent.created_at > lastSeen) {
          setMuted(nostrEvent);
          decryptMuteList(nostrEvent);
        }
      }
      if (event.kind === COMMUNITIES) {
        const lastSeen = communities?.created_at ?? 0;
        if (nostrEvent.created_at > lastSeen) {
          setCommunities(nostrEvent);
        }
      }
      if (event.kind === PEOPLE) {
        const d = event.tagValue("d");
        if (!deprecatedPeopleLists.has(d)) {
          const t = event.tagValue("t");
          const lastSeen = peopleLists[d]?.created_at ?? 0;
          if (d && nostrEvent.created_at > lastSeen) {
            setPeopleLists({ ...peopleLists, [d]: nostrEvent });
          }
        }
      }
      if (event.kind === BOOKMARKS) {
        const d = event.tagValue("d");
        if (!deprecatedBookmarkLists.has(d)) {
          const lastSeen = bookmarkLists[d]?.created_at ?? 0;
          if (nostrEvent.created_at > lastSeen) {
            setBookmarkLists({ ...bookmarkLists, [d]: nostrEvent });
          }
        }
      }
    }
  }, [pubkey, events]);
}

function LoggedInUser({ pubkey, isLoggedIn, onClose }) {
  const { t } = useTranslation("common");
  const relays = useAtomValue(relaysAtom);

  useFetchUserEvents(pubkey, isLoggedIn);

  return (
    <Stack align="center" direction="row" spacing={2}>
      <Link href="/write">
        <Button
          variant="dark"
          aria-label="Write"
          leftIcon={<Icon as={WriteIcon} boxSize={5} />}
        >
          {t("write")}
        </Button>
      </Link>
      <ProfileMenu pubkey={pubkey} relays={relays} onClose={onClose} />
    </Stack>
  );
}

export default function Login() {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [session, setSession] = useAtom(sessionAtom);
  const pubkey = useAtomValue(pubkeyAtom);
  const [privkey, setPrivkey] = useAtom(privkeyAtom);
  const [isLoggedIn, setIsLoggedIn] = useState();

  async function loginWithPrivateKey(privkey: string) {
    try {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
      const user = await signer.blockUntilReady();
      setSession({
        method: "privkey",
        privkey,
        pubkey: user.pubkey,
      });
      setPrivkey(null);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(`Autologin failed: ${error}`);
    }
  }

  useEffect(() => {
    if (!session || ndk.signer) {
      return;
    }
    if (session?.method === "privkey" && session?.privkey) {
      loginWithPrivateKey(session.privkey);
    }
    if (session?.method === "nip7") {
      const signer = new NDKNip07Signer();
      ndk.signer = signer;
      signer.blockUntilReady().then(() => setIsLoggedIn(true));
    }
    if (session?.method === "pubkey") {
      setIsLoggedIn(true);
    }
  }, [session?.method]);

  return pubkey ? (
    <LoggedInUser pubkey={pubkey} isLoggedIn={isLoggedIn} onClose={onClose} />
  ) : (
    <>
      <Button colorScheme="orange" onClick={onOpen}>
        {t("get-started")}
      </Button>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
