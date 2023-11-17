import { useState, useMemo } from "react";
import { FormControl, FormLabel, Stack, Text, Select } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import List from "@habla/components/nostr/List";
import { GENERAL_BOOKMARKS } from "@habla/const";
import { findTag } from "@habla/tags";

export default function BookmarkLists({ bookmarks }) {
  const { t } = useTranslation("common");
  const [selectedList, setSelectedList] = useState<null | string>(null);
  const generalBookmarks = useMemo(() => {
    return bookmarks.find((ev) => ev.kind === GENERAL_BOOKMARKS);
  }, [bookmarks]);
  const selectedBookmarks = useMemo(() => {
    if (selectedList) {
      return bookmarks.find((ev) => findTag(ev, "d") === selectedList);
    }
  }, [bookmarks, selectedList]);

  return bookmarks.length === 0 ? (
    <Text color="secondary" fontSize="sm">
      {t("no-bookmarks-found")}
    </Text>
  ) : (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>{t("select-bookmark-list")}</FormLabel>
        <Select
          value={selectedList}
          onChange={(ev) => setSelectedList(ev.target.value)}
        >
          <option key="general" value={null}>
            {t("general")}
          </option>
          {bookmarks.map((b) => {
            const d = b.tagValue("d");
            return (
              <option key={d} value={d}>
                {b.tagValue("title") || d}
              </option>
            );
          })}
        </Select>
      </FormControl>
      {selectedBookmarks ? (
        <List key={selectedList} event={selectedBookmarks} isFeed />
      ) : generalBookmarks ? (
        <List key={"general"} event={generalBookmarks} isFeed />
      ) : (
        <Text color="secondary" fontSize="sm">
          {t("empty-bookmarks")}
        </Text>
      )}
    </Stack>
  );
}
