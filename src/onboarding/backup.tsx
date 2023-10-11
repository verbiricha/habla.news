import { useState } from "react";
import { useRouter } from "next/router";
import { useAtom, useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { nip19 } from "nostr-tools";

import {
  Flex,
  Heading,
  Text,
  Input,
  Checkbox,
  Button,
  List,
  ListItem,
  ListIcon,
  UnorderedList,
} from "@chakra-ui/react";

import { pubkeyAtom, sessionAtom } from "@habla/state";
import { stepsAtom } from "@habla/onboarding/state";
import InputCopy from "@habla/components/InputCopy";
import ExternalLink from "@habla/components/ExternalLink";

export default function Backup() {
  const { t } = useTranslation("onboarding");
  const [pubkey] = useAtom(pubkeyAtom);
  const [gotIt, setGotIt] = useState(false);
  const [steps, setSteps] = useAtom(stepsAtom);
  const session = useAtomValue(sessionAtom);
  const privkey = session?.privkey;
  const router = useRouter();

  async function onDone() {
    setSteps({ ...steps, "backup-keys": true });
    await router.push("/onboarding");
  }

  return (
    <>
      <Heading>{t("your-keys")}</Heading>
      <Heading fontSize="xl">{t("public-key")}</Heading>
      <Text>{t("public-key-descr")}</Text>
      <InputCopy text={nip19.npubEncode(pubkey)} />
      {privkey && (
        <>
          <Heading fontSize="xl">{t("private-key")}</Heading>
          <Text>{t("private-key-descr")}</Text>
          <InputCopy text={nip19.nsecEncode(privkey)} />
          <Text>{t("private-key-more")}</Text>
          <UnorderedList>
            <ListItem>
              <ExternalLink href="https://getalby.com">Alby</ExternalLink>
            </ListItem>
            <ListItem>
              <ExternalLink href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp">
                nos2x
              </ExternalLink>
            </ListItem>
            <ListItem>
              <ExternalLink href="https://apps.apple.com/us/app/nostore/id1666553677">
                nostore (iOS)
              </ExternalLink>
            </ListItem>
          </UnorderedList>
        </>
      )}
      <Checkbox
        isChecked={gotIt}
        onChange={(ev) => setGotIt(ev.target.checked)}
      >
        {t("private-key-backup")}
      </Checkbox>
      <Button
        variant="solid"
        colorScheme="purple"
        maxW="120px"
        size="md"
        isDisabled={!gotIt}
        onClick={onDone}
      >
        {t("got-it")}
      </Button>
    </>
  );
}
