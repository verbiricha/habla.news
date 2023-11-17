import { useState } from "react";
import { useTranslation } from "next-i18next";
import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import {
  Flex,
  Stack,
  Heading,
  Icon,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
} from "@chakra-ui/react";

import { pubkeyAtom, relayListAtom, relaysAtom } from "@habla/state";
import DeleteIcon from "@habla/icons/Delete";
import { dateToUnix } from "@habla/time";
import { stepsAtom } from "@habla/onboarding/state";
import { usePublishEvent } from "@habla/nostr/hooks";
import RelayFavicon from "@habla/components/RelayFavicon";
import { RELAYS } from "@habla/const";

export default function RelayEditor({ relayList, skipText, onCancel, onSave }) {
  const { t } = useTranslation("common");
  const [relay, setRelay] = useState();
  const [, setRelayList] = useAtom(relayListAtom);
  const [defaultRelays] = useAtom(relaysAtom);
  const [relays, setRelays] = useState(
    relayList?.tags.map((r) => r.at(1)) ?? defaultRelays
  );
  const isValidRelay =
    relay?.startsWith("ws://") || relay?.startsWith("wss://");
  const publish = usePublishEvent({ showToast: false });

  async function publishRelayList() {
    const created_at = dateToUnix();

    const newRelays = {
      kind: RELAYS,
      content: "",
      created_at,
      tags: relays.map((r) => ["r", r]),
    };

    try {
      await publish(newRelays, {});
    } catch (error) {
      console.error(error);
    } finally {
      return newRelays;
    }
  }

  async function onDone() {
    try {
      const relayList = await publishRelayList();
      setRelayList(relayList);
      onSave(relayList);
    } catch (error) {
      console.error(error);
    }
  }

  function addRelay() {
    if (!relays.includes(relay)) {
      setRelays([...relays, relay]);
      setRelay("");
    }
  }

  return (
    <Stack spacing={4}>
      {skipText ? (
        <Heading fontSize="xl">{t("relays")}</Heading>
      ) : (
        <Heading fontSize="xl">{t("your-relays")}</Heading>
      )}
      {!skipText && (
        <>
          <Text>{t("your-relays-descr")}</Text>
          <Text>{t("your-relays-more")}</Text>
        </>
      )}
      <Card variant="elevated">
        <CardBody>
          {relays.map((r) => (
            <Flex alignItems="center" gap={3} key={r}>
              <RelayFavicon url={r} />
              <Text fontFamily="monospace" fontSize="sm">
                {r}
              </Text>
              <IconButton
                variant="ghost"
                ml="auto"
                colorScheme="red"
                aria-label="delete"
                icon={<Icon as={DeleteIcon} boxSize={5} />}
                onClick={() => setRelays(relays.filter((rel) => rel != r))}
              />
            </Flex>
          ))}
        </CardBody>
      </Card>
      <FormControl mt={4}>
        <FormLabel>{t("add-relay-label")}</FormLabel>
        <Flex gap={4}>
          <Input
            type="text"
            value={relay}
            onChange={(e) => setRelay(e.target.value)}
            placeholder={t("add-relay-placeholder")}
          />
          <Button
            isDisabled={!isValidRelay}
            variant="solid"
            colorScheme="orange"
            onClick={addRelay}
          >
            {t("add-relay-cta")}
          </Button>
        </Flex>
        <FormHelperText>{t("add-relay-label-help")}</FormHelperText>
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
