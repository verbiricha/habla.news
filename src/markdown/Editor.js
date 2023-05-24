import { useRef, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";

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
} from "@chakra-ui/react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { nip19 } from "nostr-tools";

import { dateToUnix } from "@habla/time";
import { urlsToNip27 } from "@habla/nip27";
import { LONG_FORM, LONG_FORM_DRAFT } from "@habla/const";
import { usePublishEvent } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Markdown from "@habla/markdown/Markdown";
import LongFormNote from "@habla/components/LongFormNote";

// todo: link to markdown reference
export default function MyEditor({ event, showPreview }) {
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
        await router.push(`/a/${naddr}`);
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
    <LongFormNote event={ev} isDraft excludeAuthor />
  ) : (
    <>
      <Flex flexDirection="column" alignItems="flex-start">
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          dir="auto"
          id="title"
          value={title}
          placeholder="Title for your article"
          onChange={(ev) => setTitle(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormLabel>Content</FormLabel>
        <MdEditor
          ref={ref}
          placeholder="Speak your mind"
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
        <FormLabel htmlFor="image">Image</FormLabel>
        <Input
          id="image"
          placeholder="Link to the main article image"
          value={image}
          onChange={(ev) => setImage(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormLabel htmlFor="summary">Summary</FormLabel>
        <Textarea
          id="summary"
          dir="auto"
          placeholder="A brief summary of what your article is about"
          value={summary}
          onChange={(ev) => setSummary(ev.target.value)}
          size="md"
        />
        <FormLabel htmlFor="tags" mt={2}>
          Tags
        </FormLabel>
        <Input
          id="tags"
          dir="auto"
          value={hashtags}
          placeholder="List of tags separated by comma: nostr, markdown"
          onChange={(ev) => setHashtags(ev.target.value)}
          size="md"
          mb={2}
        />

        <Flex my={4} justifyContent="space-between" width="100%">
          <Button variant="solid" onClick={() => onSave()}>
            Save draft
          </Button>
          <Button variant="solid" colorScheme="orange" onClick={() => onPost()}>
            {event?.kind === 30023 && event?.sig ? "Update" : "Post"}
          </Button>
        </Flex>

        <FormLabel htmlFor="identifer" mt={2}>
          Identifier
        </FormLabel>
        <Input
          id="identifier"
          value={slug}
          onChange={(ev) => setSlug(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormLabel>
          <Code>d</Code> field
        </FormLabel>
      </Flex>
    </>
  );
}
