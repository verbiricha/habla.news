import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import levenshtein from "js-levenshtein";
import { useTranslation } from "next-i18next";
import {
  useColorModeValue,
  useDisclosure,
  Button,
  Flex,
  Stack,
  HStack,
  Box,
  Heading,
  Text,
  Link,
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
import { useAtom } from "jotai";

import User from "./nostr/User";

import { getMetadata } from "@habla/nip23";
import Blockquote from "@habla/components/Blockquote";
import Markdown from "@habla/markdown/Markdown";
import Hashtags from "@habla/components/Hashtags";
import Highlighter from "@habla/icons/Highlighter";
import WriteIcon from "@habla/icons/Write";
import Highlight from "@habla/components/nostr/Highlight";
import Highlights from "@habla/components/reactions/Highlights";
import HighlightModal from "@habla/components/HighlightModal";
import ShareModal from "@habla/components/ShareModal";
import Write from "@habla/components/Write";
import Zaps from "@habla/components/Zaps";
import Reposts from "@habla/components/Reposts";
import Comments from "@habla/components/Comments";
import Bookmarks from "@habla/components/Bookmarks";
import { RecommendedAppMenu } from "@habla/components/nostr/UnknownKind";
import { PublishedIn } from "@habla/components/nostr/feed/LongFormNote";
import { pubkeyAtom, relaysAtom } from "@habla/state";
import { useTextSelection } from "@habla/hooks/useTextSelection";
import {
  useAppAddress,
  useClientAddress,
} from "@habla/components/nostr/UnknownKind";
import { formatDay } from "@habla/format";
import { ZAP, HIGHLIGHT, REACTION } from "@habla/const";

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

const MAX_DISTANCE = 7;

function HighlightsDrawer({ highlights, selected, isOpen, onClose }) {
  const bg = useColorModeValue("white", "layer");

  const highlightsToShow = highlights.filter((event) => {
    return (
      event.content === selected ||
      selected?.includes(event.content) ||
      event.content.includes(selected) ||
      (event.content &&
        selected &&
        selected.length > 2 * MAX_DISTANCE &&
        levenshtein(event.content, selected) < MAX_DISTANCE)
    );
  });

  return (
    <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={bg}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading>Highlights</Heading>
        </DrawerHeader>
        <DrawerBody>
          <Stack>
            {highlightsToShow.reverse().map((event) => (
              <Box key={event.id}>
                <Highlight showReactions key={event.id} event={event} />
              </Box>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function PublishedVia({ address }) {
  const { app } = useAppAddress(address);
  const name = app?.display_name || app?.name;
  return (
    app && (
      <Text color="secondary" fontSize="2xs">
        published via{" "}
        {app.website ? (
          <Link
            isExternal
            href={app.website}
            textDecoration="underline"
            textDecorationStyle="dotted"
          >
            {name}
          </Link>
        ) : (
          <Text as="span" color="secondary" fontSize="2xs">
            {name}
          </Text>
        )}
      </Text>
    )
  );
}

export default function LongFormNote({
  event,
  isDraft,
  zaps = [],
  notes = [],
  highlights = [],
  reposts = [],
  bookmarks = [],
  isEditingInline,
}) {
  const ref = useRef();
  const [pubkey] = useAtom(pubkeyAtom);
  const clientAddr = useClientAddress(event);
  const [selected, setSelected] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure("highlight");
  const shareModal = useDisclosure("share-modal");
  const highlightModal = useDisclosure();
  const { title, summary, image, hashtags, publishedAt, community } = useMemo(
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
    if (highlight) {
      setSelected(highlight);
      onOpen();
    }
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
      <Bookmarks event={event} bookmarks={bookmarks} />
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
        <Stack mb={6}>
          {image?.length > 0 && (
            <Image src={image} alt={title} width="100%" maxHeight="520px" />
          )}
          <Heading as="h1" fontSize="4xl" mt={2} mb={1}>
            {title}
          </Heading>
          {summary?.length > 0 && (
            <Box my={1}>
              <Blockquote fontSize="lg" fontFamily="'Source Serif Pro'">
                {summary}
              </Blockquote>
            </Box>
          )}
          <Box mb={2}>
            <Hashtags hashtags={hashtags} />
          </Box>
          <Box mb={1.5}>{reactions}</Box>
          <Flex
            alignItems={clientAddr ? "flex-start" : "center"}
            gap={2}
            wrap="wrap"
            justifyContent="space-between"
          >
            <Stack>
              <Flex align="center" gap={3} fontFamily="Inter">
                {event.pubkey && <User pubkey={event.pubkey} />}
                {publishedAt && (
                  <Text color="secondary" fontSize="sm">
                    {formatDay(publishedAt)}
                  </Text>
                )}
              </Flex>
              {clientAddr && <PublishedVia address={clientAddr} />}
            </Stack>
            <Flex gap={1}>
              {!isEditingInline && isMine && (
                <Button
                  maxW="12em"
                  aria-label="Edit"
                  size={{ base: "xs", sm: "sm" }}
                  onClick={() => setIsEditing(true)}
                >
                  {t("edit")}
                </Button>
              )}
              {!isEditingInline && (
                <>
                  <Button
                    maxW="12em"
                    aria-label="Share"
                    onClick={shareModal.onOpen}
                    size={{ base: "xs", sm: "sm" }}
                  >
                    {t("share")}
                  </Button>
                  <RecommendedAppMenu event={event} />
                </>
              )}
            </Flex>
          </Flex>
        </Stack>
        <Box as="article">
          <Markdown
            content={event.content}
            tags={event.tags}
            highlights={highlights}
            onHighlightClick={onHighlightClick}
          />
        </Box>
      </Box>
      {community && <PublishedIn community={community} event={event} />}

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

      {event.pubkey && <ShareModal event={event} {...shareModal} />}

      <HighlightsDrawer
        selected={selected}
        highlights={highlights}
        isOpen={isOpen}
        onClose={onClose}
      />

      {event && event.encode && (
        <Box>
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
