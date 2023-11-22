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
  Box,
  Button,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { nip19 } from "nostr-tools";
import slugify from "slugify";

import { dateToUnix } from "@habla/time";
import { urlsToNip27 } from "@habla/nip27";
import {
  HABLA_PUBKEY,
  HABLA_ADDRESS,
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
import { useUser } from "@habla/nostr/hooks";
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
import { toPubkey } from "@habla/util";

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
    <FormControl>
      <FormLabel htmlFor="identifer">{t("community")}</FormLabel>
      <Select
        placeholder={t("select-community")}
        value={selected}
        onChange={onChange}
      >
        {followedCommunities.map((t) => {
          const [, address] = t;
          const [, , d] = address.split(":");
          return (
            <option key={address} value={address}>
              {d}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
}

function PublishModal({ event, initialZapSplits, isDraft, isOpen, onClose }) {
  const { t } = useTranslation("common");
  const ndk = useNdk();
  const router = useRouter();
  const [relays] = useAtom(relaysAtom);
  const [link, setLink] = useState();
  const [pubkey] = useAtom(pubkeyAtom);
  const [relaySelection, setRelaySelection] = useState(relays);
  const { data: relayMetadata } = useRelaysMetadata(relaySelection);
  const splitSuggestions = useMemo(() => {
    const relayOperators =
      relayMetadata
        ?.map((m) => m.pubkey)
        .filter((p) => p && p != pubkey)
        .map(toPubkey)
        .filter((p) => p) ?? [];
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
      let link;
      if (!isDraft && !findTag(ndkEvent, "alt")) {
        link = articleLink(ndkEvent);
        ndkEvent.tags.push([
          "alt",
          `This is a long form article, you can read it in https://habla.news${link}`,
        ]);
      }
      if (!isDraft && !findTag(ndkEvent, "client")) {
        ndkEvent.tags.push([
          "client",
          HABLA_ADDRESS,
          "wss://relay.nostr.band",
          "web",
        ]);
      }
      await ndkEvent.sign();
      const results = await ndkEvent.publish(relaySet, 5_000);
      setPublishedOn(Array.from(results).map((r) => r.url));
      setHasPublished(true);
      onCloseModal();
      if (link) {
        await router.push(link, undefined, { shallow: true });
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
            <FeedLongFormNote
              event={nostrEvent}
              excludeReactions={true}
              skipModeration={true}
            />
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
            isLoading={isPublishing}
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

export default function EventEditor({ event, showPreview }) {
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
  const [publishedAt, setPublishedAt] = useState(metadata?.publishedAt);
  const [publishedDate, setPublishedDate] = useState(
    publishedAt ? new Date(publishedAt * 1000) : null
  );

  function onDateChange(d) {
    if (d) {
      const unixTs = d.getTime() / 1000;
      setPublishedAt(unixTs);
      setPublishedDate(d);
    } else {
      setPublishedAt();
      setPublishedDate(null);
    }
  }

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
  const createdAt = dateToUnix();
  const htags = hashtags
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const ttags = htags.map((t) => ["t", t]);
  const tags = [
    ["d", slug],
    ["title", title],
    ["summary", summary],
    ["published_at", publishedAt ? String(publishedAt) : String(createdAt)],
    ...ttags,
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

  const editor = (
    <Flex flexDirection="column" gap={3} alignItems="flex-start" mb={10}>
      <FormControl>
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
      </FormControl>
      <FormControl>
        <FormLabel>{t("content")}</FormLabel>
        <MdEditor
          ref={ref}
          placeholder={t("content-placeholder")}
          value={content}
          renderHTML={(text) => <Markdown content={content} tags={tags} />}
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
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="image">{t("image")}</FormLabel>
        <Input
          id="image"
          value={image}
          onChange={(ev) => setImage(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormHelperText>{t("image-helper")}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="summary">{t("summary")}</FormLabel>
        <Textarea
          id="summary"
          dir="auto"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
          size="md"
        />
        <FormHelperText>{t("summary-helper")}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="tags">{t("tags")}</FormLabel>
        <Input
          id="tags"
          dir="auto"
          value={hashtags}
          placeholder={""}
          onChange={(ev) => setHashtags(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormHelperText>{t("tags-helper")}</FormHelperText>
      </FormControl>

      <CommunitySelector
        initialCommunity={initialCommunity}
        onCommunitySelect={setCommunity}
      />

      <Flex my={4} justifyContent="space-between" width="100%">
        <Button variant="solid" onClick={onSaveDraft}>
          {t("save-draft")}
        </Button>
        <Button variant="solid" colorScheme="orange" onClick={onSave}>
          {event?.kind === LONG_FORM && event?.sig ? t("update") : t("post")}
        </Button>
      </Flex>

      <FormControl>
        <FormLabel htmlFor="identifer">{t("identifier")}</FormLabel>
        <Input
          id="identifier"
          value={slug}
          onChange={(ev) => setSlug(ev.target.value)}
          size="md"
          mb={2}
        />
      </FormControl>
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
      <FormControl>
        <FormLabel>{t("published-at")}</FormLabel>
        <DatePicker
          className="date-picker"
          selected={publishedDate}
          onChange={onDateChange}
        />
        <FormHelperText>{t("published-at-helper")}</FormHelperText>
      </FormControl>
    </Flex>
  );

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
      {editor}
    </>
  );
}
