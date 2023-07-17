import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { useNdk, usePublishEvent } from "@habla/nostr/hooks";
import { NDKPrivateKeySigner } from "habla-ndk";

import { defaultRelays } from "@habla/state";
import {
  useDisclosure,
  Avatar,
  Flex,
  Box,
  Image,
  Stack,
  Input,
  Tag,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { dateToUnix } from "@habla/time";
import NostrAvatar from "@habla/components/nostr/Avatar";
import User from "@habla/components/nostr/User";
import useTopTags from "@habla/hooks/useTopTags";
import Hashtags from "@habla/components/Hashtags";
import { getPubkey, featured } from "@habla/nip05";

enum Steps {
  NAME = "NAME",
  AVATAR = "AVATAR",
  TOPICS = "TOPICS",
  FOLLOWS = "FOLLOWS",
  FINISHED = "FINISHED",
}

export default function NewUser() {
  const ndk = useNdk();
  const publish = usePublishEvent({ showToast: false, debug: true });
  const privkey = useMemo(() => {
    return generatePrivateKey();
  }, []);
  const pubkey = useMemo(() => {
    return getPublicKey(privkey);
  }, [privkey]);
  const [step, setStep] = useState(Steps.NAME);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState();
  const [tags, setTags] = useState([]);
  const [follows, setFollows] = useState([]);
  const { t } = useTranslation("common");
  const topTags = useTopTags(12);
  const { isOpen, onOpen, onClose } = useDisclosure("onboarding");

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

  function loginWithPrivkey() {
    try {
      const signer = new NDKPrivateKeySigner(privkey);
      ndk.signer = signer;
    } catch (error) {
      console.error(error);
    }
  }

  async function onDone() {
    loginWithPrivkey();
    // todo: kind 0, kind 3, kind 10002
    const profile = {
      kind: 0,
      content: JSON.stringify({ name }),
      created_at: dateToUnix(),
      tags: [],
    };
    try {
      await publish(profile, {});
    } catch (error) {
      console.error(error);
    }
    //onClose();
  }

  const canGoNext =
    step === Steps.NAME
      ? name.trim().length > 0
      : step === Steps.AVATAR
      ? avatar
      : step === Steps.FOLLOWS
      ? follows.length > 0
      : step === Steps.TOPICS
      ? tags.length > 0
      : true;

  return (
    <>
      <Button onClick={onOpen}>{t("create-account")}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {step === Steps.NAME && (
              <Heading fontSize="xl">{t("what-we-will-call-you")}</Heading>
            )}
            {step === Steps.AVATAR && (
              <Heading fontSize="xl">{t("add-avatar")}</Heading>
            )}
            {step === Steps.TOPICS && (
              <Heading fontSize="xl">{t("pick-topics")}</Heading>
            )}
            {step === Steps.FOLLOWS && (
              <Heading fontSize="xl">{t("follow-people")}</Heading>
            )}
            {step === Steps.FINISHED && (
              <Heading fontSize="xl">{t("finished")}</Heading>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack align="center" spacing={2} my={5}>
              {step === Steps.NAME && (
                <>
                  <Input
                    autoFocus
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                  />
                  <Text
                    fontSize="sm"
                    color="secondary"
                    fontFamily="'Inter'"
                    ml={2}
                  >
                    {t("you-can-change-later")}
                  </Text>
                </>
              )}
              {step === Steps.AVATAR && (
                <>
                  {avatar ? (
                    <Avatar size="lg" src={avatar} />
                  ) : (
                    <NostrAvatar size="lg" pubkey={pubkey} />
                  )}
                  <Input
                    placeholder={t("image-url")}
                    value={avatar}
                    onChange={(ev) => setAvatar(ev.target.value)}
                  />
                </>
              )}
              {step === Steps.TOPICS && (
                <Flex flexWrap="wrap" gap={1}>
                  {topTags.map((t) => {
                    const isSelected = tags.includes(t);
                    return (
                      <Tag
                        cursor="pointer"
                        variant="outline"
                        key={t}
                        size="sm"
                        colorScheme={isSelected ? "purple" : "white"}
                        fontWeight={300}
                        onClick={() =>
                          isSelected
                            ? setTags(tags.filter((tag) => tag !== t))
                            : setTags([...tags, t])
                        }
                      >
                        {t}
                      </Tag>
                    );
                  })}
                </Flex>
              )}
              {step === Steps.FOLLOWS && (
                <Stack w="100%" gap={2}>
                  {featured.map((handle) => {
                    const pubkey = getPubkey(handle);
                    const following = follows.includes(pubkey);
                    return (
                      <Flex
                        key={pubkey}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <User pubkey={pubkey} />
                        <Button
                          isDisabled={following}
                          variant="outline"
                          onClick={() =>
                            following ? null : setFollows([...follows, pubkey])
                          }
                        >
                          {following ? t("following") : t("follow")}
                        </Button>
                      </Flex>
                    );
                  })}
                </Stack>
              )}
              {step === Steps.FINISHED && (
                <Image src="/family.png" alt={t("finished")} />
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack w="100%">
              {step === Steps.FINISHED ? (
                <Button colorScheme="purple" onClick={onDone}>
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
