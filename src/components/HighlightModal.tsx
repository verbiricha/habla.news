import { useState, useMemo } from "react";
import { useAtom } from "jotai";

import {
  useToast,
  Flex,
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
import { NDKEvent, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { useTranslation } from "next-i18next";
import { nip19 } from "nostr-tools";

import AccordionMenu from "@habla/components/AccordionMenu";
import RelaySelector from "@habla/components/RelaySelector";
import ZapSplitConfig from "@habla/components/ZapSplitConfig";
import { HIGHLIGHT } from "@habla/const";
import { getMetadata } from "@habla/nip23";
import Highlight from "@habla/components/nostr/Highlight";
import User from "@habla/components/nostr/User";
import { pubkeyAtom, relaysAtom } from "@habla/state";
import { useRelaysMetadata } from "@habla/hooks/useRelayMetadata";
import { useNdk } from "@habla/nostr/hooks";
import { filterTags } from "@habla/tags";
import { HABLA_PUBKEY, HABLA_ADDRESS } from "@habla/const";

export default function HighlightModal({
  event,
  content,
  context,
  isOpen,
  onClose,
}) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const toast = useToast();
  const [relays] = useAtom(relaysAtom);
  const [pubkey] = useAtom(pubkeyAtom);
  const { title } = getMetadata(event);
  const [relaySelection, setRelaySelection] = useState(relays);
  const { data: relayMetadata } = useRelaysMetadata(relaySelection);
  const splitSuggestions = useMemo(() => {
    const relayOperators =
      relayMetadata
        ?.map((m) => m.pubkey)
        .filter((p) => p && p != pubkey)
        .map((p) => {
          if (p.startsWith("npub")) {
            return nip19.decode(p)?.data;
          } else {
            return p;
          }
        })
        .filter((p) => p) ?? [];
    return relayOperators.concat([HABLA_PUBKEY]);
  }, [relayMetadata]);
  const initialZapSplits = useMemo(() => {
    const existingZapSplits = filterTags(event, "zap");
    if (existingZapSplits.length > 0) {
      return existingZapSplits;
    }
    if (pubkey !== event.pubkey) {
      return [
        ["zap", event.pubkey, "wss://purplepag.es", "2"],
        ["zap", pubkey, "wss://purplepag.es", "1"],
      ];
    }
  }, [pubkey, event]);
  const [zapSplits, setZapSplits] = useState(initialZapSplits);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const [publishedOn, setPublishedOn] = useState([]);

  const highlight = useMemo(() => {
    const ev = {
      kind: HIGHLIGHT,
      created_at: Math.round(Date.now() / 1000),
      content,
      tags: [
        ["p", event.pubkey],
        [
          "alt",
          `This is a highlight created in https://habla.news\n"${content}"`,
        ],
        ["client", HABLA_ADDRESS, "wss://relay.nostr.band", "web"],
      ],
    };
    if (event.tagReference) {
      ev.tags.push(event.tagReference());
    }
    if (context) {
      ev.tags.push(["context", context.text]);
    }
    const zapTags = zapSplits ? zapSplits.filter((z) => z.at(3) !== "0") : null;
    if (zapTags && zapTags.length > 0) {
      ev.tags = ev.tags.concat(zapTags);
    }
    return ev;
  }, [event, content, context, zapSplits]);

  async function onHighlight() {
    try {
      setIsPublishing(true);
      const relaySet = NDKRelaySet.fromRelayUrls(relaySelection, ndk);
      const signed = new NDKEvent(ndk, highlight);
      await signed.sign();
      const results = await signed.publish(relaySet, 5_000);
      setPublishedOn(Array.from(results).map((r) => r.url));
      setHasPublished(true);
      toast({
        status: "success",
        title: t("highlighted"),
        description: `"${content}"`,
      });
      onClose();
    } catch (error) {
      toast({
        status: "error",
        title: t("something-went-wrong"),
        description: error?.message,
      });
    } finally {
      setIsPublishing(false);
    }
  }
  const menu = [
    {
      title: t("relays"),
      description: t("select-relays"),
      panel: (
        <RelaySelector
          isPublishing={isPublishing}
          hasPublished={hasPublished}
          publishedOn={publishedOn}
          onChange={setRelaySelection}
        />
      ),
    },
    {
      title: t("revenue"),
      description: t("revenue-descr"),
      panel: (
        <ZapSplitConfig
          initialZapSplits={initialZapSplits}
          splitSuggestions={splitSuggestions}
          relaySelection={relaySelection}
          onChange={setZapSplits}
        />
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="lg">{t("highlight")}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontFamily="'Inter'">
          <Highlight
            skipModeration
            event={highlight}
            showHeader={false}
            showReactions={false}
          />
          <AccordionMenu
            defaultIndex={initialZapSplits?.length ? [1] : []}
            items={menu}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            {t("close")}
          </Button>
          <Button
            isLoading={isPublishing}
            onClick={onHighlight}
            colorScheme="orange"
          >
            {t("highlight")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
