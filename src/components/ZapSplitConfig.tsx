import { useMemo, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import {
  Flex,
  Stack,
  Text,
  Checkbox,
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

export default function ZapSplitConfig({
  initialZapSplits,
  relaySelection,
  onChange,
  splitSuggestions,
}) {
  // todo: use user relay for profile metadata
  // todo: add/remove pubkey/nip05
  const { t } = useTranslation("common");
  const [pubkey] = useAtom(pubkeyAtom);
  const hasDefaults = Boolean(initialZapSplits?.length);
  const [enableSplits, setEnableSplits] = useState(hasDefaults);
  const [zapSplits, setZapSplits] = useState(
    hasDefaults ? initialZapSplits : []
  );

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
    </Stack>
  );
}
