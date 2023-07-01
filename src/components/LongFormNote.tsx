import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "next-i18next";
import {
  useColorModeValue,
  useDisclosure,
  Button,
  Flex,
  Stack,
  Box,
  Heading,
  Text,
  Image,
  Icon,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorMode,
} from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";

import User from "./nostr/User";

import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import Blockquote from "@habla/components/Blockquote";
import Markdown from "@habla/markdown/Markdown";
import Hashtags from "@habla/components/Hashtags";
import { formatDay } from "@habla/format";
import Highlighter from "@habla/icons/Highlighter";
import WriteIcon from "@habla/icons/Write";
import Highlight from "@habla/components/nostr/feed/Highlight";
import Highlights from "@habla/components/reactions/Highlights";
import HighlightModal from "@habla/components/HighlightModal";
import { useTextSelection } from "@habla/hooks/useTextSelection";
import Write from "@habla/components/Write";
import { pubkeyAtom, relaysAtom } from "@habla/state";
import Zaps from "./Zaps";
import Reposts from "./Reposts";
import Comments from "./Comments";

const Thread = dynamic(() => import("@habla/components/nostr/Thread"), {
  ssr: false,
});

function deselect() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    document.selection.empty();
  } else {
    console.log("Can't deselect");
  }
}

function HighlightsDrawer({ highlights, selected, isOpen, onClose }) {
  const stackRef = useRef();
  const initialFocusRef = useRef();
  const bg = useColorModeValue("white", "layer");

  //useEffect(() => {
  //  if (isOpen) {
  //    if (initialFocusRef.current) {
  //      stackRef.scrollTo(initialFocusRef.current);
  //    }
  //  }
  //}, [isOpen, initialFocusRef]);

  return (
    <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={bg}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading>Highlights</Heading>
        </DrawerHeader>
        <DrawerBody>
          <Stack ref={stackRef}>
            {highlights.reverse().map((event) => (
              <Box ref={event.id === selected?.id ? initialFocusRef : null}>
                <Highlight key={event.id} event={event} />
              </Box>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default function LongFormNote({
  event,
  isDraft,
  zaps = [],
  notes = [],
  highlights = [],
  reposts = [],
  isEditingInline,
}) {
  const ref = useRef();
  const [pubkey] = useAtom(pubkeyAtom);
  const [selected, setSelected] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const highlightModal = useDisclosure();
  const { title, summary, image, hashtags, publishedAt } = useMemo(
    () => getMetadata(event),
    [event]
  );
  const isMine = pubkey === event.pubkey;
  const [textSelection, setTextSelection] = useState();
  const [ctx, setCtx] = useState();
  const { context, textContent, isCollapsed, clientRect } = useTextSelection(
    ref.current
  );
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!highlightModal.isOpen) {
      setTextSelection(textContent);
      setCtx(context);
    }
  }, [textContent]);

  function onHighlightClick(highlight) {
    setSelected(highlight);
    onOpen();
  }

  function onHighlightOpen() {
    highlightModal.onOpen();
    deselect();
  }

  const reactions = isDraft ? null : (
    <Flex alignItems="center" gap={6}>
      <Zaps event={event} zaps={zaps} />
      <Reposts event={event} reposts={reposts} />
      <Highlights event={event} highlights={highlights} />
      <Comments event={event} comments={notes} />
    </Flex>
  );

  const { colorMode } = useColorMode();

  return isMine && isEditing ? (
    <Write pubkey={pubkey} ev={event} isEditingInline>
      <Button
        variant="write"
        aria-label="Edit"
        bg="secondary"
        color="white"
        onClick={() => setIsEditing(false)}
      >
        {t("cancel")}
      </Button>
    </Write>
  ) : (
    <>
      <Box sx={{ wordBreak: "break-word" }} ref={ref} dir="auto">
        <Stack gap={2} mb={6}>
          {image?.length > 0 && (
            <Image src={image} alt={title} width="100%" maxHeight="520px" />
          )}
          <Flex justifyContent="space-between">
            <Heading as="h1" fontSize="4xl">
              {title}
            </Heading>
            {!isEditingInline && isMine && (
              <Button
                variant="write"
                aria-label="Edit"
                bg="secondary"
                color="white"
                onClick={() => setIsEditing(true)}
                leftIcon={<Icon as={WriteIcon} boxSize={5} />}
              >
                {t("edit")}
              </Button>
            )}
          </Flex>
          {summary?.length > 0 && (
            <Blockquote fontSize="lg">{summary}</Blockquote>
          )}
          <Hashtags hashtags={hashtags} />
          {reactions}
          <Flex align="center" gap={3} fontFamily="Inter">
            {event.pubkey && <User pubkey={event.pubkey} />}
            <Text color="secondary" fontSize="sm">
              {formatDay(publishedAt)}
            </Text>
          </Flex>
        </Stack>
        <Prose>
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
            onHighlightClick={onHighlightClick}
          />
        </Prose>
      </Box>

      {textSelection?.length ? (
        <Box sx={{ position: "fixed", bottom: 4, right: 4 }}>
          <IconButton
            colorScheme="orange"
            icon={<Highlighter />}
            onClick={onHighlightOpen}
          />
        </Box>
      ) : null}

      <HighlightModal
        event={event}
        content={textSelection}
        context={ctx}
        {...highlightModal}
        onClose={() => {
          setTextSelection("");
          setCtx();
          highlightModal.onClose();
        }}
      />

      <HighlightsDrawer
        selected={selected}
        highlights={highlights}
        isOpen={isOpen}
        onClose={onClose}
      />

      {event && event.encode && (
        <Box>
          <style>
            {colorMode == "light"
              ? `
            :root {
              --ztr-font: Inter;
              --ztr-text-color: #2B2B2B;
              --ztr-textarea-color: #2B2B2B;
              --ztr-icon-color: #656565;
              --ztr-link-color:  #92379c;
              --ztr-login-button-color: var(--chakra-colors-orange-500);
              --ztr-background-color: rgba(0, 0, 0, 0.03);
            }
          `
              : `
            :root {
              --ztr-font: Inter;
              --ztr-text-color: #dedede;
              --ztr-icon-color: #656565;
              --ztr-link-color: #e4b144;
              --ztr-login-button-color: #5e584b;
              --ztr-background-color: rgba(255, 255, 255, 0.05);
            }
          `}
          </style>
          <Thread anchor={event.encode()} />
        </Box>
      )}
      <Box mt="120px">
        <Text color="secondary" textAlign="center">
          𐡷
        </Text>
      </Box>
    </>
  );
}
