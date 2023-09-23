import { useState } from "react";
import {
  useToast,
  useDisclosure,
  Heading,
  Modal,
  Button,
  Textarea,
  Stack,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import { REPOST, NOTE } from "@habla/const";
import { dateToUnix } from "@habla/time";
import { pubkeyAtom } from "@habla/state";
import RepostIcon from "@habla/icons/Repost";
import ReactionCount from "@habla/components/reactions/ReactionCount";
import Event from "@habla/components/nostr/Event";
import { useNdk } from "@habla/nostr/hooks";

function RepostModal({ event, isOpen, onClose }) {
  const ndk = useNdk();
  const toast = useToast();
  const [comment, setComment] = useState();
  const { t } = useTranslation("common");

  async function onRepost() {
    const evTags = event.tags.filter((t) => ["e", "a", "p"].includes(t.at(0)));
    const tag = event.tagReference();
    const p = ["p", event.pubkey];
    const k = ["k", String(event.kind)];

    try {
      const ev = {
        kind: REPOST,
        created_at: dateToUnix(),
        tags: [tag, p, k],
        content: "",
      };
      const signed = new NDKEvent(ndk, ev);
      await signed.sign();
      await signed.publish();
      if (comment && comment.trim().length > 0) {
        const ev = {
          kind: NOTE,
          created_at: dateToUnix(),
          tags: [signed.tagReference(), p],
          content: `${comment.trim()}\n\nnostr:${signed.encode()}`,
        };
        const note = new NDKEvent(ndk, ev);
        await note.sign();
        await note.publish();
      }
      toast({
        status: "success",
        title: t("reposted"),
      });
    } catch (error) {
      toast({
        status: "error",
        title: t("something-went-wrong"),
        description: error.message,
      });
    } finally {
      onClose();
      setComment();
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="lg">{t("repost")}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Stack gap={2}>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment (optional)"
            />
            <Event event={event} />{" "}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            {t("close")}
          </Button>
          <Button onClick={onRepost} colorScheme="orange">
            {t("repost")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function Reposts({ event, reposts }) {
  const modal = useDisclosure();
  const [pubkey] = useAtom(pubkeyAtom);
  const reposted = reposts.some((r) => r.pubkey === pubkey);

  return (
    <>
      <ReactionCount
        cursor="pointer"
        color={reposted ? "highlight" : "secondary"}
        icon={RepostIcon}
        reactions={reposts}
        onClick={modal.isOpen ? modal.onClose : modal.onOpen}
      />
      <RepostModal event={event} {...modal} />
    </>
  );
}
