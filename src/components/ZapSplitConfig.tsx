import { useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import {
  Flex,
  Stack,
  Text,
  Checkbox,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

import User from "@habla/components/nostr/User";
import { useRelaysMetadata } from "@habla/hooks/useRelayMetadata";
import { pubkeyAtom, relaysAtom } from "@habla/state";
import { formatShortNumber } from "@habla/format";
import { nip05, nip19 } from "nostr-tools";

function ProfileSelector({ selectedPubkeys, onPubkeySelect, ...rest }) {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState("");
  const [error, setError] = useState();
  const [isFetching, setIsFetching] = useState(false);

  function onChange(ev) {
    setSearch(ev.target.value);
    setError();
  }

  async function onAdd() {
    try {
      let pubkey;
      const decoded = nip19.decode(search);
      if (decoded?.type === "npub") {
        pubkey = decoded.data;
      } else if (decoded?.type === "nprofile") {
        pubkey = decoded.data.pubkey;
      }

      if (pubkey) {
        if (selectedPubkeys.includes(pubkey)) {
          setError(t("pubkey-already-added"));
        } else {
          onPubkeySelect(pubkey);
          setSearch("");
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    try {
      setIsFetching(true);
      let pubkey;
      const profile = await nip05.queryProfile(search);
      if (profile) {
        pubkey = profile.pubkey;
      }

      if (pubkey) {
        if (selectedPubkeys.includes(pubkey)) {
          setError(t("pubkey-already-added"));
        } else {
          onPubkeySelect(pubkey);
          setSearch("");
        }
      }
    } catch (error) {
      console.error(error);
      setError(error?.message);
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <FormControl isInvalid={error}>
      <FormLabel>{t("add-pubkey")}</FormLabel>
      <InputGroup>
        <Input
          paddingRight={"4.5em"}
          value={search}
          onChange={onChange}
          {...rest}
        />
        <InputRightElement width="4.5rem">
          <Button
            isLoading={isFetching}
            isDisabled={isFetching}
            h="1.75rem"
            size="sm"
            onClick={onAdd}
          >
            {t("add")}
          </Button>
        </InputRightElement>
      </InputGroup>
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        <FormHelperText>{t("add-pubkey-helper")}</FormHelperText>
      )}
    </FormControl>
  );
}

export default function ZapSplitConfig({
  initialZapSplits,
  relaySelection,
  onChange,
  splitSuggestions,
}) {
  const { t } = useTranslation("common");
  const [pubkey] = useAtom(pubkeyAtom);
  const hasDefaults = Boolean(initialZapSplits?.length);
  const [enableSplits, setEnableSplits] = useState(hasDefaults);
  const [zapSplits, setZapSplits] = useState(
    hasDefaults ? initialZapSplits : []
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (enableSplits && !hasDefaults) {
      const split = [
        [
          "zap",
          pubkey,
          "wss://purplepag.es",
          String(100 - splitSuggestions.length),
        ],
        ...splitSuggestions?.map((p) => ["zap", p, "wss://purplepag.es", "1"]),
      ];
      setZapSplits(split);
      onChange(split);
    } else if (enableSplits & hasDefaults) {
      setZapSplits(initialZapSplits);
      onChange(initialZapSplits);
    } else if (!enableSplits) {
      setZapSplits([]);
      onChange();
    }
  }, [enableSplits, hasDefaults, splitSuggestions]);
  const totalWeight = useMemo(() => {
    return zapSplits.reduce((acc, z) => acc + Number(z.at(3)), 0);
  }, [zapSplits]);
  const canTweak = useMemo(() => {
    return zapSplits?.length > 1;
  }, [zapSplits]);

  function addPubkey(pk: string) {
    const tag = ["zap", pk, "wss://purplepag.es", "1"];
    const newZapSplits = zapSplits ? zapSplits.concat([tag]) : [tag];
    setZapSplits(newZapSplits);
    onChange(newZapSplits);
  }

  return (
    <Stack spacing={3} my={2}>
      <Checkbox
        isChecked={enableSplits}
        onChange={(e) => setEnableSplits(e.target.checked)}
      >
        <Text>{t("enable-splits")}</Text>
      </Checkbox>
      {enableSplits &&
        zapSplits.map((z, idx) => {
          const percentage = Number(z.at(3)) / totalWeight;

          function changeWeight(v) {
            const newSplits = zapSplits.map((oldZap, i) =>
              i === idx ? ["zap", oldZap.at(1), oldZap.at(2), v] : oldZap
            );
            setZapSplits(newSplits);
            onChange(newSplits);
          }

          function removeFromSplit() {
            const newSplits = zapSplits
              .map((oldZap, i) => (i === idx ? [] : [oldZap]))
              .flat();
            setZapSplits(newSplits);
            onChange(newSplits);
          }

          return (
            <Flex align="center" justifyContent="space-between">
              <User pubkey={z.at(1)} size="xs" />
              <Flex align="center">
                <Flex gap={2} align="center">
                  <Text as="span" fontSize="xs" color="secondary">
                    {formatShortNumber((percentage * 100).toFixed(0))}%
                  </Text>
                  <NumberInput
                    w="80px"
                    isDisabled={!canTweak}
                    defaultValue={z.at(3)}
                    min={0}
                    step={1}
                    onChange={changeWeight}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>
                <IconButton
                  isDisabled={!canTweak}
                  cursor="pointer"
                  boxSize={3}
                  variant="unstyled"
                  as={CloseIcon}
                  color="red.200"
                  onClick={canTweak ? removeFromSplit : null}
                />
              </Flex>
            </Flex>
          );
        })}
      {enableSplits && (
        <ProfileSelector
          selectedPubkeys={zapSplits.map((z) => z.at(1))}
          onPubkeySelect={addPubkey}
        />
      )}
    </Stack>
  );
}
