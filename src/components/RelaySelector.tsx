import { useState } from "react";

import { useAtom } from "jotai";
import {
  Flex,
  Stack,
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
  const [relays] = useAtom(relaysAtom);
  const [publishOn, setPublishOn] = useState(() => {
    return relays.reduce((acc, r) => {
      return { ...acc, [r]: true };
    }, {});
  });

  return (
    <Stack spacing={3} my={2}>
      <CheckboxGroup colorScheme="purple">
        <Stack spacing={2} direction={"column"}>
          {relays.map((r) => (
            <Flex key={r} alignItems="center" justifyContent="space-between">
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
                  publishOn[r] &&
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
