import { useState, useMemo, type ReactNode } from "react";
import { useTranslation } from "next-i18next";
import { useAtomValue } from "jotai";
import {
  Flex,
  Button,
  IconButton,
  Heading,
  Menu,
  MenuDivider,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
import { NDKEvent, NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";
import { AddIcon, HamburgerIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";

import { draftAtom } from "@habla/state";
import { getMetadata } from "@habla/nip23";
import { LONG_FORM, LONG_FORM_DRAFT } from "@habla/const";
import { useEvents } from "@habla/nostr/hooks";
import Events from "@habla/components/nostr/feed/Events";
import Editor from "@habla/markdown/Editor";

interface WriteProps {
  pubkey: string;
  ev?: NDKEvent;
  isEditingInline: boolean;
  children: ReactNode;
}

export default function Write({
  pubkey,
  ev,
  isEditingInline,
  children,
}: WriteProps) {
  const { t } = useTranslation("common");
  const [showPreview, setShowPreview] = useState(false);
  const localDraft = useAtomValue(draftAtom);
  const [event, setEvent] = useState(localDraft || ev);
  const { events } = useEvents(
    {
      kinds: [LONG_FORM, LONG_FORM_DRAFT],
      authors: [pubkey],
    },
    {
      closeOnEose: true,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    }
  );
  const posts = events.filter((e) => e.kind === LONG_FORM);
  const published = posts.map((e) => getMetadata(e).identifier);
  const drafts = events.filter((e) => {
    const publishedArticle = posts.find(
      (p) => getMetadata(p).identifier === getMetadata(e).identifier
    );
    const shouldShowDraft =
      !publishedArticle || publishedArticle.created_at < e.created_at;
    return e.kind === LONG_FORM_DRAFT && shouldShowDraft;
  });
  const key = useMemo(() => {
    if (!event) return "";
    return event.id || JSON.stringify(event.tags.find((t) => t[0] === "d"));
  }, [event]);
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        {showPreview ? (
          <Button
            leftIcon={<EditIcon />}
            size="md"
            aria-label={t("edit")}
            onClick={() => setShowPreview(false)}
            variant="outline"
          >
            {t("edit")}
          </Button>
        ) : (
          <Button
            leftIcon={<ViewIcon />}
            size="md"
            aria-label={t("preview")}
            onClick={() => setShowPreview(true)}
            variant="outline"
          >
            {t("preview")}
          </Button>
        )}
        {isEditingInline ? (
          children
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              aria-label="Options"
              size="md"
              leftIcon={<HamburgerIcon />}
              variant="outline"
            >
              {t("my-articles")}
            </MenuButton>
            <MenuList maxW="90vw">
              <MenuItem icon={<AddIcon />} onClick={() => setEvent()}>
                {t("new")}
              </MenuItem>
              <MenuDivider />
              {drafts.length > 0 && (
                <>
                  <MenuGroup title={t("drafts")}>
                    {drafts.map((d) => (
                      <MenuItem key={d.id} onClick={() => setEvent(d)}>
                        {getMetadata(d).title}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                  <MenuDivider />
                </>
              )}
              <MenuGroup title={t("articles")}>
                {posts.map((p) => (
                  <MenuItem
                    sx={{ wordBreak: "break-word" }}
                    key={p.id}
                    onClick={() => setEvent(p)}
                  >
                    {getMetadata(p).title}
                  </MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
        )}
      </Flex>
      <Editor key={key} showPreview={showPreview} event={event} />
    </>
  );
}
