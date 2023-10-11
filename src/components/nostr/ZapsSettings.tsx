import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { nip19 } from "nostr-tools";
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
  Textarea,
} from "@chakra-ui/react";

import { pubkeyAtom } from "@habla/state";
import { dateToUnix } from "@habla/time";
import { stepsAtom } from "@habla/onboarding/state";
import { usePublishEvent } from "@habla/nostr/hooks";
import InputCopy from "@habla/components/InputCopy";
import ExternalLink from "@habla/components/ExternalLink";
import ImageUploader from "@habla/components/ImageUploader";
import { PROFILE } from "@habla/const";

const BitcoinConnectButton = dynamic(
  () => import("@getalby/bitcoin-connect-react").then(({ Button }) => Button),
  { ssr: false }
);

export default function ZapsSettings({ profile, onCancel, onSave, skipText }) {
  // todo: wallet selector: webln, nwc
  const { t } = useTranslation("common");
  const [pubkey] = useAtom(pubkeyAtom);
  const [steps, setSteps] = useAtom(stepsAtom);
  const [lud16, setLud16] = useState(profile?.lud16);
  const publish = usePublishEvent({ showToast: false });

  async function publishProfile() {
    const created_at = dateToUnix();

    const user = profile ? { ...profile, lud16 } : { lud16 };
    // remove internal fields
    delete user.id;
    delete user.emoji;

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

  return (
    <Stack spacing={4}>
      {skipText ? (
        <Heading fontSize="xl">{t("lnaddress-label")}</Heading>
      ) : (
        <Heading fontSize="xl">{t("zaps-settings")}</Heading>
      )}
      {!skipText && (
        <>
          <Text>{t("zaps-settings-descr")}</Text>
          <Text>{t("zaps-settings-more")}</Text>
        </>
      )}
      <FormControl>
        <FormLabel>{t("lnaddress-label")}</FormLabel>
        <Input
          type="text"
          value={lud16}
          onChange={(e) => setLud16(e.target.value)}
          placeholder={t("lnaddress-placeholder")}
        />
        <FormHelperText>{t("lnaddress-help")}</FormHelperText>
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
      <Flex mt={4}>
        <BitcoinConnectButton />
      </Flex>
    </Stack>
  );
}
