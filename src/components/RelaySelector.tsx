import { useMemo, useState, useEffect } from "react";

import { useAtom } from "jotai";
import { useToast } from "@chakra-ui/react";
import {
  Flex,
  Stack,
  Button,
  Text,
  Checkbox,
  CheckboxGroup,
  Spinner,
  Modal,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { useNdk } from "@habla/nostr/hooks";
import { relaysAtom } from "@habla/state";
import RelayFavicon from "@habla/components/RelayFavicon";

export default function RelaySelector({
  title = "Publish",
  event,
  isOpen,
  onClose,
  onPublished,
}) {
  const ndk = useNdk();
  const toast = useToast();
  const [relays] = useAtom(relaysAtom);
  const [publishOn, setPublishOn] = useState(
    relays.reduce((acc, r) => {
      return { ...acc, [r]: true };
    }, {})
  );

  async function onPublish() {
    try {
      await ndk.publish(event);
      // todo: honor relay selection
      toast({
        title: "Published",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Error while publishing",
        description: error?.message,
        status: "error",
      });
    } finally {
      onPublished(event);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text>Select the relays to publish to:</Text>
            <CheckboxGroup colorScheme="purple">
              <Stack spacing={1} direction={"column"}>
                {relays.map((r) => (
                  <Checkbox
                    key={r}
                    onChange={(e) =>
                      setPublishOn({ ...publishOn, [r]: e.target.checked })
                    }
                    isChecked={publishOn[r]}
                  >
                    <Flex alignItems="center" gap={2}>
                      <RelayFavicon url={r} size="xs" />
                      <Text>{r}</Text>{" "}
                    </Flex>
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onPublish} colorScheme="orange">
            Publish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
