import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import {
  NDKUser,
  NDKNip07Signer,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import { useAtom } from "jotai";
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
import { AtSignIcon, ChevronDownIcon, WarningIcon } from "@chakra-ui/icons";

import { PROFILE, PEOPLE, BOOKMARKS, CONTACTS, RELAYS } from "@habla/const";
import SettingsIcon from "@habla/icons/Settings";
import RelayIcon from "@habla/icons/Relay";
import WriteIcon from "@habla/icons/Write";
import ExternalLink from "@habla/components/ExternalLink";
import NewUser from "@habla/onboarding/NewUser";
import Avatar from "@habla/components/nostr/Avatar";
import { useEvents } from "@habla/nostr/hooks";
import {
  relaysAtom,
  pubkeyAtom,
  privkeyAtom,
  contactListAtom,
  relayListAtom,
  communitiesAtom,
  peopleListsAtom,
  defaultRelays,
} from "@habla/state";
import { findTag } from "@habla/tags";
import { useIsOnboarding } from "@habla/onboarding/hooks";
import { useNdk } from "@habla/nostr/hooks";

function LoginDialog({ isOpen, onClose }) {
  const ndk = useNdk();
  const [pubkeyLike, setPubkeyLike] = useState();
  const [relays] = useAtom(relaysAtom);
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
        setPubkey(user.hexpubkey);
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
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);
  const [privkey, setPrivkey] = useAtom(privkeyAtom);

  async function loginWithPrivateKey() {
    try {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
      const user = await signer.blockUntilReady();
      setPubkey(user.hexpubkey);
    } catch (error) {
      console.error(`Autologin failed: ${error}`);
    }
  }

  useEffect(() => {
    if (pubkey === undefined && privkey) {
      loginWithPrivateKey();
    }
  }, [pubkey, privkey]);

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
          <ModalHeader>{!flow && t("get-started")}</ModalHeader>
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
  const router = useRouter();
  const [, setPubkey] = useAtom(pubkeyAtom);
  const [, setPrivkey] = useAtom(privkeyAtom);
  const [, setContactList] = useAtom(contactListAtom);
  const [, setPeopleLists] = useAtom(peopleListsAtom);
  const isOnboarding = useIsOnboarding();
  const nprofile = useMemo(() => {
    if (pubkey) {
      return nip19.nprofileEncode({
        pubkey,
        relays,
      });
    }
  }, [pubkey, relays]);

  function logOut(ev) {
    setPeopleLists([]);
    setPubkey(null);
    setPrivkey(null);
    setContactList(null);
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
        <MenuDivider />
        <MenuItem icon={<WarningIcon />} onClick={logOut}>
          {t("logout")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function LoggedInUser({ pubkey, onClose }) {
  const ndk = useNdk();
  const [relays] = useAtom(relaysAtom);
  const [contacts, setContactList] = useAtom(contactListAtom);
  const { events } = useEvents(
    {
      kinds: [CONTACTS, RELAYS],
      authors: [pubkey],
    },
    {
      cacheUsage: "ONLY_RELAY",
      closeOnEose: false,
    }
  );
  const { t } = useTranslation("common");
  const [relayList, setRelayList] = useAtom(relayListAtom);
  const [communities, setCommunities] = useAtom(communitiesAtom);
  const [, setPeopleLists] = useAtom(peopleListsAtom);

  useEffect(() => {
    const fn = async () => {
      for (const event of events) {
        const nostrEvent = await event.toNostrEvent();
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
      }
    };
    fn();
  }, [events]);

  useEffect(() => {
    // People lists
    ndk
      .fetchEvents({
        kinds: [PEOPLE],
        authors: [pubkey],
      })
      .then((people) => {
        if (people) {
          const peopleLists = Array.from(people)
            .filter((p) => {
              const d = findTag(p, "d");
              const t = findTag(p, "t");
              const outdatedD = ["mute", "p:mute", "pin", "pinned"];
              // discard outdated pre nip-51 lists
              return !outdatedD.includes(d) && !outdatedD.includes(t);
            })
            .filter((p) => p.tags.find((t) => t.at(0) === "p"));
          setPeopleLists(peopleLists);
        }
      });
    // Communities
    ndk
      .fetchEvent({
        kinds: [BOOKMARKS],
        authors: [pubkey],
        "#d": ["communities"],
      })
      .then((c) => {
        if (c) {
          const lastSeen = communities?.created_at ?? 0;
          if (c.created_at > lastSeen) {
            setCommunities(c);
          }
        }
      });
  }, [pubkey]);
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
  const toast = useToast();
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);
  const [privkey, setPrivkey] = useAtom(privkeyAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("common");

  return pubkey ? (
    <LoggedInUser pubkey={pubkey} onClose={onClose} />
  ) : (
    <>
      <Button colorScheme="orange" onClick={onOpen}>
        {t("get-started")}
      </Button>
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
