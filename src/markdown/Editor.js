import { useRef, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

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
} from "@chakra-ui/react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { nip19 } from "nostr-tools";

import { dateToUnix } from "@habla/time";
import { urlsToNip27 } from "@habla/nip27";
import { COMMUNITY, LONG_FORM, LONG_FORM_DRAFT } from "@habla/const";
import { usePublishEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Markdown from "@habla/markdown/Markdown";
import LongFormNote from "@habla/components/LongFormNote";
import { useEvents } from "@habla/nostr/hooks";
import { findTag } from "@habla/tags";

function isCommunityTag(t) {
  return t.startsWith(`${COMMUNITY}:`);
}

function CommunitySelector({ initialCommunity, onCommunitySelect }) {
  const { t } = useTranslation("common");
  const [selected, setSelected] = useState(initialCommunity);
  const { events } = useEvents({
    kinds: [COMMUNITY],
  });

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
        {events.map((e) => (
          <option value={e.tagId()}>{findTag(e, "d")}</option>
        ))}
      </Select>
    </>
  );
}

export default function MyEditor({ event, showPreview }) {
  const { t } = useTranslation("common");
  const toast = useToast();
  const publish = usePublishEvent();
  const ref = useRef();
  const router = useRouter();
  const metadata = event && getMetadata(event);
  const [isPublishing, setIsPublishing] = useState(false);
  const [title, setTitle] = useState(metadata?.title ?? "");
  const [slug, setSlug] = useState(metadata?.identifier ?? String(Date.now()));
  const [summary, setSummary] = useState(metadata?.summary ?? "");
  const [image, setImage] = useState(metadata?.image ?? "");
  const [publishedAt] = useState(metadata?.publishedAt);
  const [hashtags, setHashtags] = useState(
    metadata?.hashtags?.join(", ") ?? ""
  );
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

  async function onPost() {
    try {
      setIsPublishing(true);
      const signed = await publish(ev, {
        successTitle: "Posted",
        sucessMessage: "",
        errorTitle: "Couldn't sign post",
        errorMessage: "",
      });
      if (signed) {
        const naddr = nip19.naddrEncode({
          kind: signed.kind,
          pubkey: signed.pubkey,
          identifier: getMetadata(signed).identifier,
        });
        await router.push(`/a/${naddr}`, undefined, { shallow: true });
      }
    } finally {
      setIsPublishing(false);
    }
  }

  async function onSave() {
    try {
      setIsPublishing(true);
      const s = {
        ...ev,
        kind: LONG_FORM_DRAFT,
      };
      await publish(s, {
        successTitle: "Draft saved",
        sucessMessage: "",
        errorTitle: "Couldn't save draft",
        errorMessage: "",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.nodeMdText.current.dir = "auto";
    }
  }, [ref, showPreview]);

  return showPreview ? (
    <LongFormNote event={ev} isDraft excludeAuthor isEditingInline={true} />
  ) : (
    <>
      <Flex flexDirection="column" alignItems="flex-start">
        <FormLabel htmlFor="title">{t("title")}</FormLabel>
        <Input
          dir="auto"
          id="title"
          value={title}
          placeholder={t("title-placeholder")}
          onChange={(ev) => setTitle(ev.target.value)}
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
          <Button variant="solid" onClick={() => onSave()}>
            {t("save-draft")}
          </Button>
          <Button variant="solid" colorScheme="orange" onClick={() => onPost()}>
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
      </Flex>
    </>
  );
}
