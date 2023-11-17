import { useCallback, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import throttle from "lodash/throttle";
import { nip05 as nostrAddress, nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import {
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";

import { pubkeyAtom } from "@habla/state";
import { dateToUnix } from "@habla/time";
import { stepsAtom } from "@habla/onboarding/state";
import { usePublishEvent } from "@habla/nostr/hooks";
import InputCopy from "@habla/components/InputCopy";
import ExternalLink from "@habla/components/ExternalLink";
import ImageUploader from "@habla/components/ImageUploader";
import { PROFILE } from "@habla/const";

export default function ProfileEditor({ profile, onCancel, onSave }) {
  const { t } = useTranslation("common");
  const [pubkey] = useAtom(pubkeyAtom);
  const [steps, setSteps] = useAtom(stepsAtom);
  const [avatar, setAvatar] = useState(profile?.picture);
  const [website, setWebsite] = useState(profile?.website);
  const [name, setName] = useState(profile?.name);
  const [about, setAbout] = useState(profile?.about);
  const [nip05, setNip05] = useState(profile?.nip05);
  const [nip05profile, setNip05profile] = useState();
  const [isChekingNip05, setIsCheckingNip05] = useState(false);
  const publish = usePublishEvent({ showToast: false });
  const isValidNip05 = nip05profile?.pubkey === pubkey;

  const checkNip05 = useCallback(
    throttle(async function (newNip05: string) {
      try {
        setIsCheckingNip05(true);
        const profile = await nostrAddress.queryProfile(newNip05);
        if (profile) {
          setNip05profile(profile);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingNip05(false);
      }
    }, 2000),
    []
  );

  useEffect(() => {
    if (nip05) {
      checkNip05(nip05);
    }
  }, [nip05]);

  async function publishProfile() {
    const created_at = dateToUnix();

    const user = profile ? { ...profile, name } : { name };
    // remove internal fields
    delete user.id;
    delete user.emoji;
    if (avatar) {
      user.picture = avatar;
    }
    if (website) {
      user.website = website;
    }
    if (about) {
      user.about = about;
    }
    if (nip05 && isValidNip05) {
      user.nip05 = nip05;
    }

    const newProfile = {
      kind: PROFILE,
      content: JSON.stringify(user),
      created_at,
      tags: [],
    };

    try {
      await publish(newProfile, {});
    } catch (error) {
      console.error(error);
    } finally {
      return newProfile;
    }
  }

  async function onDone() {
    try {
      const profile = await publishProfile();
      onSave(profile);
    } catch (error) {
      console.error(error);
    }
  }

  function onImageUpload(img) {
    setAvatar(img);
  }

  return (
    <Stack spacing={4}>
      <Heading fontSize="xl">{t("your-profile")}</Heading>
      <FormControl>
        <FormLabel>{t("avatar-label")}</FormLabel>
        <ImageUploader pubkey={pubkey} onImageUpload={onImageUpload} />
      </FormControl>
      <FormControl>
        <FormLabel>{t("name-label")}</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("name-placeholder")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t("about-label")}</FormLabel>
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder={t("about-placeholder")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t("website-label")}</FormLabel>
        <Input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder={t("website-placeholder")}
        />
      </FormControl>
      <FormControl>
        <FormLabel>{t("nip05-label")}</FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={nip05}
            onChange={(e) => setNip05(e.target.value)}
            placeholder={t("nip05-placeholder")}
          />
          {!isChekingNip05 && isValidNip05 && (
            <InputRightElement>
              <CheckIcon color="green.500" />
            </InputRightElement>
          )}
          {!isChekingNip05 &&
            nip05profile &&
            nip05profile.pubkey !== pubkey && (
              <InputRightElement>
                <WarningIcon color="red.500" />
              </InputRightElement>
            )}
        </InputGroup>
        <FormHelperText>{t("nip05-help")}</FormHelperText>
      </FormControl>
      <Flex gap={2}>
        {onCancel && (
          <Button variant="solid" maxW="120px" size="md" onClick={onCancel}>
            {t("cancel")}
          </Button>
        )}
        <Button
          variant="solid"
          colorScheme="purple"
          maxW="120px"
          size="md"
          onClick={onDone}
        >
          {t("save")}
        </Button>
      </Flex>
    </Stack>
  );
}
