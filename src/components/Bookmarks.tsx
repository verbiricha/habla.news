import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import {
  useDisclosure,
  useToast,
  Stack,
  Heading,
  Select,
  Text,
  Divider,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import BookmarkIcon from "@habla/icons/Bookmark";
import ReactionCount from "@habla/components/reactions/ReactionCount";
import { dateToUnix } from "@habla/time";
import { pubkeyAtom, bookmarkListsAtom } from "@habla/state";
import { useNdk } from "@habla/nostr/hooks";
import { BOOKMARKS } from "@habla/const";

function NewBookmarkList({ isOpen, onClose, onCreateList }) {
  const ndk = useNdk();
  const { t } = useTranslation("common");
  const toast = useToast();
  const [isBusy, setIsBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function closeModal() {
    setTitle("");
    setDescription("");
    onClose();
  }

  async function createList() {
    try {
      setIsBusy(true);
      const ev = {
        kind: BOOKMARKS,
        content: "",
        tags: [["d", title]],
        created_at: dateToUnix(),
      };
      if (description.length > 0) {
        ev.tags.push(["summary", description]);
      }

      const signed = new NDKEvent(ndk, ev);
      await signed.sign();
      await signed.publish();

      closeModal();
      toast({
        title: t("bookmark-list-created"),
        description: t("bookmark-list-created-descr"),
      });

      onCreateList(signed);
    } catch (error) {
      toast({
        status: "error",
        title: t("something-went-wrong"),
        description: error.message,
      });
    } finally {
      setIsBusy(false);
    }
  }

  const content = (
    <Stack>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={title} onChange={(ev) => setTitle(ev.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
      </FormControl>
    </Stack>
  );

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="lg">{t("new-bookmark-list")}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">{content}</ModalBody>

        <ModalFooter>
          <Button
            isDisabled={title.length === 0}
            isLoading={isBusy}
            onClick={createList}
            colorScheme="orange"
          >
            {t("create")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function BookmarkModal({ event, isOpen, onClose }) {
  const ndk = useNdk();
  const toast = useToast();
  const { t } = useTranslation("common");
  const [bookmarkLists] = useAtom(bookmarkListsAtom);
  const [isBusy, setIsBusy] = useState(false);
  const [selectedList, setSelectedList] = useState();
  const lists = useMemo(() => {
    return Object.entries(bookmarkLists);
  }, [bookmarkLists]);
  const hasLists = lists.length > 0;
  const newModal = useDisclosure();

  async function onBookmark() {
    if (selectedList) {
      const listEv = bookmarkLists[selectedList];
      const ev = {
        kind: BOOKMARKS,
        content: listEv.content,
        created_at: dateToUnix(),
        tags: listEv.tags.concat([event.tagReference()]),
      };

      try {
        setIsBusy(true);
        const signed = new NDKEvent(ndk, ev);
        await signed.sign();
        await signed.publish();
        onClose();
        toast({
          title: t("bookmark-saved"),
        });
      } catch (error) {
        toast({
          status: "error",
          title: t("something-went-wrong"),
          description: error.message,
        });
      } finally {
        setIsBusy(false);
      }
    }
  }

  function onCreateList(ev) {
    if (ev) {
      setBookmarkLists((bl) => {
        const d = ev.tagValue("d");
        return { ...bl, [d]: ev };
      });
      setSelectedList(ev);
    }
    newModal.onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="lg">{t("bookmark")}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Stack gap={4}>
            {hasLists ? (
              <FormControl>
                <Select
                  placeholder={t("choose-a-list")}
                  value={selectedList}
                  onChange={(ev) => setSelectedList(ev.target.value)}
                >
                  {lists.map((l) => {
                    const [d] = l;
                    return <option value={d}>{d}</option>;
                  })}
                </Select>
              </FormControl>
            ) : (
              <Text>{t("no-bookmarks")}</Text>
            )}
            <Divider />
            <Button onClick={newModal.onOpen}>
              {t("create-bookmark-list")}
            </Button>
            {newModal.isOpen && (
              <NewBookmarkList {...newModal} onCreateList={setSelectedList} />
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            {t("close")}
          </Button>
          <Button
            isLoading={isBusy}
            isDisabled={!selectedList}
            onClick={onBookmark}
            colorScheme="orange"
          >
            {t("bookmark")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function Bookmarks({ event, bookmarks }) {
  const modal = useDisclosure();
  const [pubkey] = useAtom(pubkeyAtom);
  const bookmarked = bookmarks.some((r) => r.pubkey === pubkey);
  return (
    <>
      <ReactionCount
        cursor="pointer"
        icon={BookmarkIcon}
        reactions={bookmarks}
        onClick={modal.isOpen ? modal.onClose : modal.onOpen}
      />
      <BookmarkModal event={event} {...modal} />
    </>
  );
}
