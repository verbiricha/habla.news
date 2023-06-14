import { useMemo } from "react";
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
import Highlight from "@habla/components/nostr/feed/Highlight";
import User from "@habla/components/nostr/User";
import { useNdk } from "@habla/nostr/hooks";

export default function HighlightModal({
  event,
  content,
  context,
  isOpen,
  onClose,
}) {
  const ndk = useNdk();
  const toast = useToast();
  const { title } = getMetadata(event);

  const highlight = useMemo(() => {
    const ev = {
      kind: HIGHLIGHT,
      created_at: Math.round(Date.now() / 1000),
      content,
      tags: [["p", event.pubkey], event.tagReference()],
    };
    if (context) {
      ev.tags.push(["context", context.text]);
      //ev.tags.push(["range", context.start, context.end, "context"]);
    }
    return ev;
  }, [event, content, context]);

  async function onHighlight() {
    try {
      const signed = new NDKEvent(ndk, highlight);
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
          <Highlight
            event={highlight}
            showHeader={false}
            showReactions={false}
          />
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
