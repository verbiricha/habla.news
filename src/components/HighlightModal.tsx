import {
  useToast,
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
import { NDKEvent } from "@nostr-dev-kit/ndk";

import { HIGHLIGHT } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import Blockquote from "@habla/components/Blockquote";
import User from "@habla/components/nostr/User";
import { useNdk } from "@habla/nostr/hooks";

export default function HighlightModal({ event, content, isOpen, onClose }) {
  const ndk = useNdk();
  const toast = useToast();
  const { title } = getMetadata(event);
  async function onHighlight() {
    try {
      const ev = {
        kind: HIGHLIGHT,
        created_at: Math.round(Date.now() / 1000),
        content,
        tags: [["p", event.pubkey], event.tagReference()],
      };
      const signed = new NDKEvent(ndk, ev);
      await signed.sign();
      await ndk.publish(signed);
      toast({
        status: "success",
        title: "✍️ Highlighted",
        description: `"${content}"`,
      });
      onClose();
    } catch (error) {
      toast({
        status: "error",
        title: "Something went wrong",
        description: error?.message,
      });
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="lg">{title}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Blockquote>{content}</Blockquote>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button onClick={onHighlight} colorScheme="orange">
            Highlight
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
