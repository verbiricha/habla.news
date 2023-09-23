import { useRef, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { NDKRelaySet, NDKEvent } from "@nostr-dev-kit/ndk";

import { useDisclosure } from "@chakra-ui/react";
import {
  useToast,
  Flex,
  Code,
  Box,
  Button,
  Stack,
  FormLabel,
  Input,
  Text,
  Textarea,
  Select,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { nip19 } from "nostr-tools";
import slugify from "slugify";

import { dateToUnix } from "@habla/time";
import { urlsToNip27 } from "@habla/nip27";
import {
  HABLA_PUBKEY,
  COMMUNITY,
  LONG_FORM,
  LONG_FORM_DRAFT,
} from "@habla/const";
import { useNdk, usePublishEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Markdown from "@habla/markdown/Markdown";
import AccordionMenu from "@habla/components/AccordionMenu";
import LongFormNote from "@habla/components/LongFormNote";
import FeedLongFormNote from "@habla/components/nostr/feed/LongFormNote";
import ZapSplitConfig from "@habla/components/ZapSplitConfig";
import { useEvents, useUser } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";
import { articleLink } from "@habla/components/nostr/ArticleLink";
import { useRelaysMetadata } from "@habla/hooks/useRelayMetadata";
import {
  pubkeyAtom,
  relaysAtom,
  communitiesAtom,
  contactListAtom,
} from "@habla/state";
import { getHandle } from "@habla/nip05";
import RelaySelector from "@habla/components/RelaySelector";
import User from "@habla/components/nostr/User";

function isCommunityTag(t) {
  return t.startsWith(`${COMMUNITY}:`);
}

function CommunitySelector({ initialCommunity, onCommunitySelect }) {
  const { t } = useTranslation("common");
  const [selected, setSelected] = useState(initialCommunity);
  const [communities] = useAtom(communitiesAtom);
  const followedCommunities = useMemo(() => {
    return (
      communities?.tags.filter(
        (t) => t.at(0) === "a" && t.at(1)?.startsWith(`${COMMUNITY}:`)
      ) || []
    );
  }, [communities]);

  function onChange(e) {
    setSelected(e.target.value);
    onCommunitySelect(e.target.value);
  }

  return (
    <>
      <FormLabel htmlFor="identifer" mt={2}>
        {t("community")}
      </FormLabel>
      <Select
        placeholder={t("select-community")}
        value={selected}
        onChange={onChange}
      >
        {followedCommunities.map((t) => {
          const [, address] = t;
          const [, , d] = address.split(":");
          return <option value={address}>{d}</option>;
        })}
      </Select>
    </>
  );
}

function PublishModal({ event, initialZapSplits, isDraft, isOpen, onClose }) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const [relays] = useAtom(relaysAtom);
  const [link, setLink] = useState();
  const [pubkey] = useAtom(pubkeyAtom);
  const [relaySelection, setRelaySelection] = useState(relays);
  const { data: relayMetadata } = useRelaysMetadata(relaySelection);
  const splitSuggestions = useMemo(() => {
    const relayOperators =
      relayMetadata?.map((m) => m.pubkey).filter((p) => p && p != pubkey) ?? [];
    return relayOperators.concat([HABLA_PUBKEY]);
  }, [relayMetadata]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const [publishedOn, setPublishedOn] = useState([]);
  const [zapSplits, setZapSplits] = useState(initialZapSplits);
  const nostrEvent = useMemo(() => {
    const zapTags = zapSplits ? zapSplits.filter((z) => z.at(3) !== "0") : null;
    const ev = isDraft
      ? { ...event, pubkey, kind: LONG_FORM_DRAFT }
      : { ...event, pubkey };
    if (zapTags && zapTags.length > 0) {
      ev.tags = ev.tags.concat(zapTags);
    }
    return ev;
  }, [event, zapSplits]);

  async function onPost() {
    try {
      setIsPublishing(true);
      const relaySet = NDKRelaySet.fromRelayUrls(relaySelection, ndk);
      const ndkEvent = new NDKEvent(ndk, nostrEvent);
      await ndkEvent.sign();
      const results = await ndkEvent.publish(relaySet);
      setPublishedOn(Array.from(results).map((r) => r.url));
      setHasPublished(true);
      if (!isDraft) {
        const link = articleLink(ndkEvent);
        setLink(link);
      }
    } finally {
      setIsPublishing(false);
    }
  }

  function onCloseModal() {
    onClose();
    setIsPublishing(false);
    setHasPublished(false);
    setPublishedOn();
    setRelaySelection(relays);
    setZapSplits();
    setLink();
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
    ...(isDraft
      ? []
      : [
          {
            title: t("revenue"),
            description: t("revenue-descr"),
            panel: (
              <ZapSplitConfig
                splitSuggestions={splitSuggestions}
                initialZapSplits={initialZapSplits}
                relaySelection={relaySelection}
                onChange={setZapSplits}
              />
            ),
          },
        ]),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isDraft ? t("publish-draft") : t("publish")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FeedLongFormNote event={nostrEvent} />
            <AccordionMenu items={menu} />
            {link && (
              <Text
                as="span"
                fontFamily="Inter"
                textDecoration="underline"
                textDecorationStyle="dotted"
              >
                <Link href={link}>{`habla.news${link}`}</Link>
              </Text>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={relaySelection.length === 0}
            colorScheme="orange"
            onClick={onPost}
          >
            {t("post")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function MyEditor({ event, showPreview }) {
  const { t } = useTranslation("common");
  const toast = useToast();
  const publish = usePublishEvent({ showToast: true });
  const ref = useRef();
  const router = useRouter();
  const publishModal = useDisclosure();
  const metadata = event && getMetadata(event);
  const [pubkey] = useAtom(pubkeyAtom);
  const handle = getHandle(pubkey);
  const profile = useUser(pubkey);
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState(metadata?.title ?? "");
  const [slug, setSlug] = useState(metadata?.identifier ?? String(Date.now()));
  const [summary, setSummary] = useState(metadata?.summary ?? "");
  const [image, setImage] = useState(metadata?.image ?? "");
  const [publishedAt] = useState(metadata?.publishedAt);
  const [hashtags, setHashtags] = useState(
    metadata?.hashtags?.join(", ") ?? ""
  );
  const [isDraft, setIsDraft] = useState(false);
  const [content, setContent] = useState(event?.content ?? "");
  const initialCommunity = (event?.tags ?? [])
    .find((t) => {
      return t.at(0) === "a" && isCommunityTag(t.at(1));
    })
    ?.at(1);
  const [community, setCommunity] = useState(initialCommunity);
  const htags = hashtags
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((t) => ["t", t]);
  const createdAt = dateToUnix();
  const tags = [
    ["d", slug],
    ["title", title],
    ["summary", summary],
    ["published_at", publishedAt ? String(publishedAt) : String(createdAt)],
    ...htags,
  ];
  if (image?.length > 0) {
    tags.push(["image", image]);
  }
  if (community && isCommunityTag(community)) {
    tags.push(["a", community]);
  }
  const ev = {
    content,
    kind: LONG_FORM,
    created_at: createdAt,
    tags,
  };

  function onChange({ text }) {
    setContent(urlsToNip27(text));
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.nodeMdText.current.dir = "auto";
    }
  }, [ref, showPreview]);

  function onSaveDraft() {
    setIsDraft(true);
    publishModal.onOpen();
  }

  function onSave() {
    setIsDraft(false);
    publishModal.onOpen();
  }

  function onTitleChange(ev) {
    setTitle(ev.target.value);
    //const slug = slugify(ev.target.value.toLowerCase());
    //if (slug.trim().length) {
    //  setSlug(slug);
    //}
  }

  return showPreview ? (
    <LongFormNote event={ev} isDraft excludeAuthor isEditingInline={true} />
  ) : (
    <>
      <PublishModal
        initialZapSplits={event?.tags.filter((t) => t.at(0) === "zap")}
        event={ev}
        isDraft={isDraft}
        {...publishModal}
      />
      <Flex flexDirection="column" alignItems="flex-start" mb={10}>
        <FormLabel htmlFor="title">{t("title")}</FormLabel>
        <Input
          dir="auto"
          id="title"
          value={title}
          placeholder={t("title-placeholder")}
          onChange={onTitleChange}
          size="md"
          mb={2}
        />
        <FormLabel>{t("content")}</FormLabel>
        <MdEditor
          ref={ref}
          placeholder={t("content-placeholder")}
          value={content}
          renderHTML={(text) => (
            <Prose>
              <Markdown content={content} tags={tags} />
            </Prose>
          )}
          config={{
            view: {
              menu: true,
              md: true,
              html: false,
            },
          }}
          style={{
            width: "100%",
            height: "500px",
          }}
          onChange={onChange}
        />
        <FormLabel htmlFor="image">{t("image")}</FormLabel>
        <Input
          id="image"
          placeholder={t("image-placeholder")}
          value={image}
          onChange={(ev) => setImage(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormLabel htmlFor="summary">{t("summary")}</FormLabel>
        <Textarea
          id="summary"
          dir="auto"
          placeholder={t("summary-placeholder")}
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
          size="md"
        />
        <CommunitySelector
          initialCommunity={initialCommunity}
          onCommunitySelect={setCommunity}
        />
        <FormLabel htmlFor="tags" mt={2}>
          {t("tags")}
        </FormLabel>
        <Input
          id="tags"
          dir="auto"
          value={hashtags}
          placeholder={t("tags-placeholder")}
          onChange={(ev) => setHashtags(ev.target.value)}
          size="md"
          mb={2}
        />

        <Flex my={4} justifyContent="space-between" width="100%">
          <Button variant="solid" onClick={onSaveDraft}>
            {t("save-draft")}
          </Button>
          <Button variant="solid" colorScheme="orange" onClick={onSave}>
            {event?.kind === 30023 && event?.sig ? t("update") : t("post")}
          </Button>
        </Flex>

        <FormLabel htmlFor="identifer" mt={2}>
          {t("identifier")}
        </FormLabel>
        <Input
          id="identifier"
          value={slug}
          onChange={(ev) => setSlug(ev.target.value)}
          size="md"
          mb={2}
        />
        {handle && (
          <Text
            fontFamily="Inter"
            textDecoration="underline"
            textDecorationStyle="dotted"
          >
            <Link href={`/${handle}/${slug}`}>
              {`habla.news/${handle}/${slug}`}
            </Link>
          </Text>
        )}
        {!handle && profile && profile.nip05 && (
          <Text
            fontFamily="Inter"
            textDecoration="underline"
            textDecorationStyle="dotted"
          >
            <Link href={`/u/${profile.nip05}/${slug}`}>
              {`habla.news/u/${profile.nip05}/${slug}`}
            </Link>
          </Text>
        )}
      </Flex>
    </>
  );
}
