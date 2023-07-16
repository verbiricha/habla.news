import { useMemo } from "react";
import { useTranslation } from "next-i18next";
import {
  useToast,
  Stack,
  Text,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  articleLink,
  articleAddress,
} from "@habla/components/nostr/ArticleLink";
import InputCopy from "@habla/components/InputCopy";
import { useUser } from "@habla/nostr/hooks";
import { getHandle } from "@habla/nip05";

export default function ShareModal({ event, isOpen, onClose }) {
  const { t } = useTranslation("common");
  const profile = useUser(event.pubkey);
  const link = articleLink(event, profile);
  const address = articleAddress(event);
  const toast = useToast();
  const handle = getHandle(event.pubkey);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="3xl">{t("share")}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Stack spacing={3}>
            <Text>{t("share-cta")}</Text>
            <Heading fontSize="xl">{t("share-url")}</Heading>
            <Text>{t("share-url-cta")}</Text>
            <InputCopy
              copyText={`https://habla.news${link}`}
              text={`habla.news${link}`}
            />
            <Heading fontSize="xl">{t("share-nostr")}</Heading>
            <Text>{t("share-nostr-cta")}</Text>
            <InputCopy text={address} />
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
