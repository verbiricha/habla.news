import { useState } from "react";
import { useTranslation } from "next-i18next";

import { useAtom } from "jotai";
import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

import { relaysAtom } from "@habla/state";
import RelayFavicon from "@habla/components/RelayFavicon";

export default function RelaySelector({
  isPublishing,
  hasPublished,
  publishedOn,
  onChange,
}) {
  const { t } = useTranslation("common");
  const [relays] = useAtom(relaysAtom);
  const [publishOn, setPublishOn] = useState(() => {
    return relays.reduce((acc, r) => {
      return { ...acc, [r]: true };
    }, {});
  });

  return (
    <Stack spacing={3} mt={2}>
      <Heading fontSize="xl">{t("relays")}</Heading>
      <Text>{t("select-relays")}</Text>
      <CheckboxGroup colorScheme="purple">
        <Stack spacing={2} direction={"column"}>
          {relays.map((r) => (
            <Flex alignItems="center" justifyContent="space-between">
              <Checkbox
                key={r}
                isDisabled={isPublishing}
                onChange={(e) => {
                  const newPublishOn = { ...publishOn, [r]: e.target.checked };
                  setPublishOn(newPublishOn);
                  onChange(
                    Object.entries(newPublishOn)
                      .filter((e) => {
                        const [url, enabled] = e;
                        return enabled;
                      })
                      .map((e) => e.at(0))
                  );
                }}
                isChecked={publishOn[r]}
              >
                <Flex alignItems="center" gap={2}>
                  <RelayFavicon url={r} size="xs" />
                  <Text fontFamily="monospace">{r}</Text>
                </Flex>
              </Checkbox>
              <Flex alignItems="center" justifyContent="center">
                {isPublishing && <Spinner size="sm" />}
                {hasPublished &&
                  (publishedOn.includes(r) ? (
                    <Icon boxSize={3} color="green.500" as={CheckIcon} />
                  ) : (
                    <Icon boxSize={3} color="red.500" as={CloseIcon} />
                  ))}
              </Flex>
            </Flex>
          ))}
        </Stack>
      </CheckboxGroup>
    </Stack>
  );
}
