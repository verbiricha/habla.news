import { useMemo, useState, useEffect } from "react";
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
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

import { urlsToNip27 } from "@habla/nip27";
import { LONG_FORM, LONG_FORM_DRAFT } from "@habla/const";
import { useNdk } from "@habla/nostr/hooks";
import { getMetadata } from "@habla/nip23";
import Markdown from "@habla/markdown/Markdown";
import LongFormNote from "@habla/components/LongFormNote";

function dateToUnix() {
  return Math.floor(Date.now() / 1000);
}

// todo: link to markdown reference
export default function MyEditor({ event, showPreview }) {
  const toast = useToast();
  const ndk = useNdk();
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
      // todo: mention tags
      const ndkEvent = new NDKEvent(ndk, ev);
      await ndkEvent.sign();
      await ndk.publish(ndkEvent);
      toast({
        title: "Posted",
        status: "success",
      });
      const naddr = nip19.naddrEncode({
        kind: ev.kind,
        pubkey: ev.pubkey,
        identifier: getMetadata(ev).identifier,
      });
      await router.push(`/a/${naddr}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't sign post",
        status: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  async function onSave() {
    try {
      setIsPublishing(true);
      // todo: mention tags
      const s = {
        ...ev,
        kind: LONG_FORM_DRAFT,
      };
      const ndkEvent = new NDKEvent(ndk, s);
      await ndkEvent.sign();
      await ndk.publish(ndkEvent);
      toast({
        title: "Draft saved",
        status: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Couldn't save draft",
        status: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  return showPreview ? (
    <LongFormNote event={ev} isDraft excludeAuthor />
  ) : (
    <>
      <Flex flexDirection="column" alignItems="flex-start">
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          value={title}
          placeholder="Title for your article"
          onChange={(ev) => setTitle(ev.target.value)}
          size="md"
          mb={2}
        />
        <FormLabel>Content</FormLabel>
        <MdEditor
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
          value={hashtags}
          placeholder="List of tags separated by comma: nostr, markdown"
          onChange={(ev) => setHashtags(ev.target.value)}
          size="md"
          mb={2}
        />

        <Flex my={4} justifyContent="space-between" width="100%">
          <Button
            variant="solid"
            isDisabled={event?.kind === 30023}
            onClick={() => onSave()}
          >
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
