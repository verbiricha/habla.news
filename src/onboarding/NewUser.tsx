import { useState, useMemo, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";

import {
  useDisclosure,
  useToast,
  Flex,
  Box,
  Image,
  Stack,
  Input,
  Tag,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";

import { useNdk } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import ImageUploader from "@habla/components/ImageUploader";
import useTopTags from "@habla/hooks/useTopTags";
import { dateToUnix } from "@habla/time";
import { getPubkey, featured } from "@habla/nip05";
import { PROFILE, CONTACTS, RELAYS } from "@habla/const";
import {
  defaultRelays,
  relayListAtom,
  sessionAtom,
  contactListAtom,
  relaysAtom,
} from "@habla/state";
import { initialSteps, stepsAtom } from "@habla/onboarding/state";

enum Steps {
  NAME = "NAME",
  AVATAR = "AVATAR",
  TOPICS = "TOPICS",
  FOLLOWS = "FOLLOWS",
  FINISHED = "FINISHED",
}

function TagSelector({ tags, onChange }) {
  const topTags = useTopTags(30);
  return (
    <Flex flexWrap="wrap" gap={1}>
      {topTags.map((t) => {
        const isSelected = tags.includes(t);
        return (
          <Tag
            cursor="pointer"
            variant={isSelected ? "outline" : "subtle"}
            colorScheme={isSelected ? "purple" : null}
            key={t}
            color="chakra-body-text"
            size="sm"
            fontWeight={300}
            onClick={() =>
              isSelected
                ? onChange(tags.filter((tag) => tag !== t))
                : onChange([...tags, t])
            }
          >
            {t}
          </Tag>
        );
      })}
    </Flex>
  );
}

export default function NewUser({ onDone }) {
  const ndk = useNdk();
  const toast = useToast();
  const [session, setSession] = useAtom(sessionAtom);
  const [, setRelayList] = useAtom(relayListAtom);
  const [isPublishing, setIsPublishing] = useState(false);
  const [, setSteps] = useAtom(stepsAtom);
  const [, setContactList] = useAtom(contactListAtom);
  const privkey = useMemo(() => {
    return generatePrivateKey();
  }, []);
  const pubkey = useMemo(() => {
    return getPublicKey(privkey);
  }, [privkey]);
  const [step, setStep] = useState(Steps.NAME);
  const [name, setName] = useState("");
  const [picture, setPicture] = useState();
  const [tags, setTags] = useState([]);
  const [follows, setFollows] = useState([]);
  const { t } = useTranslation("common");
  const signer = useMemo(() => new NDKPrivateKeySigner(privkey), [privkey]);

  useEffect(() => {
    setSteps(initialSteps);
  }, []);

  function onNext() {
    if (step === Steps.NAME) {
      setStep(Steps.AVATAR);
    } else if (step === Steps.AVATAR) {
      setStep(Steps.TOPICS);
    } else if (step === Steps.TOPICS) {
      setStep(Steps.FOLLOWS);
    } else {
      setStep(Steps.FINISHED);
    }
  }

  async function publish(ev) {
    const ndkEvent = new NDKEvent(ndk, ev);
    await ndkEvent.sign(signer);
    await ndkEvent.publish();
  }

  async function publishProfile() {
    const created_at = dateToUnix();

    const user = { name };
    if (picture) {
      user.picture = picture;
    }

    const profile = {
      pubkey,
      kind: PROFILE,
      content: JSON.stringify(user),
      created_at,
      tags: [],
    };

    try {
      await publish(profile);
      toast({
        description: t("profile-saved"),
        status: "success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      return profile;
    }
  }

  async function publishContactList() {
    const created_at = dateToUnix();

    const contactHashtags = tags.map((t) => ["t", t]);
    const contactPubkeys = follows.map((p) => ["p", p]);

    const contacts = {
      pubkey,
      kind: CONTACTS,
      content: "",
      created_at,
      tags: contactPubkeys.concat(contactHashtags),
    };
    try {
      await publish(contacts);
      setContactList(contacts);
      toast({
        description: t("contacts-saved"),
        status: "success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      return contacts;
    }
  }

  async function publishRelayList() {
    const created_at = dateToUnix();
    const relayTags = defaultRelays.map((r) => ["r", r]);
    const relayList = {
      pubkey,
      kind: RELAYS,
      content: "",
      created_at,
      tags: relayTags,
    };
    try {
      await publish(relayList);
      setRelayList(relayList);
      toast({
        description: t("relays-saved"),
        status: "success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      return relayList;
    }
  }

  useEffect(() => {
    const fn = async () => {
      if (step === Steps.FINISHED) {
        try {
          ndk.signer = signer;
          setIsPublishing(true);
          await publishProfile();
          await publishContactList();
          await publishRelayList();
          setSession({
            method: "privkey",
            pubkey,
            privkey,
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsPublishing(false);
        }
      }
    };
    fn();
  }, [step]);

  const canGoNext =
    step === Steps.NAME
      ? name.trim().length > 0
      : step === Steps.AVATAR
      ? picture
      : step === Steps.FOLLOWS
      ? follows.length > 0
      : step === Steps.TOPICS
      ? tags.length > 0
      : true;

  return (
    <Stack my={4}>
      <Heading fontSize="xl">
        {step === Steps.NAME && t("what-we-will-call-you")}
        {step === Steps.AVATAR && t("add-avatar")}
        {step === Steps.TOPICS && t("pick-topics")}
        {step === Steps.FOLLOWS && t("follow-people")}
        {step === Steps.FINISHED && t("finished")}
      </Heading>
      <Stack align="center" spacing={2} my={5}>
        {step === Steps.NAME && (
          <>
            <Input
              autoFocus
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <Text fontSize="sm" color="secondary" fontFamily="'Inter'" ml={2}>
              {t("you-can-change-later")}
            </Text>
          </>
        )}
        {step === Steps.AVATAR && (
          <ImageUploader
            pubkey={pubkey}
            onImageUpload={(img) => setPicture(img)}
          />
        )}
        {step === Steps.TOPICS && (
          <TagSelector tags={tags} onChange={setTags} />
        )}
        {step === Steps.FOLLOWS && (
          <Stack w="100%" gap={4} maxHeight="320px" overflow="scroll" mb={4}>
            {featured.map((handle) => {
              const pubkey = getPubkey(handle);
              const following = follows.includes(pubkey);
              return (
                <Flex
                  key={pubkey}
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <User flex={1} flexWrap="none" showBio pubkey={pubkey} />
                  <Flex ml="auto" w="120px">
                    <Button
                      w="100%"
                      isDisabled={following}
                      variant="outline"
                      onClick={() =>
                        following ? null : setFollows([...follows, pubkey])
                      }
                    >
                      {following ? t("following") : t("follow")}
                    </Button>
                  </Flex>
                </Flex>
              );
            })}
          </Stack>
        )}
        {step === Steps.FINISHED && (
          <>
            <Image src="/family.png" alt={t("finished")} />
          </>
        )}
      </Stack>
      <Stack w="100%">
        {step === Steps.FINISHED ? (
          <Button
            isLoading={isPublishing}
            colorScheme="purple"
            onClick={onDone}
          >
            {t("discover")}
          </Button>
        ) : (
          <>
            {canGoNext ? (
              <Button colorScheme="orange" onClick={onNext}>
                {t("next")}
              </Button>
            ) : (
              <Button onClick={onNext}>{t("skip")}</Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
