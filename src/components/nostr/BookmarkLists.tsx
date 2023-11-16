import { useState } from "react";
import { FormControl, FormLabel, Stack, Text, Select } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import List from "@habla/components/nostr/List";

export default function BookmarkLists({ bookmarks }) {
  const { t } = useTranslation("common");
  const [selectedList, setSelectedList] = useState(bookmarks[0]);
  return bookmarks.length === 0 ? (
    <Text color="secondary" fontSize="sm">
      {t("no-bookmarks-found")}
    </Text>
  ) : (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>{t("select-bookmark-list")}</FormLabel>
        <Select
          value={selectedList?.tagValue("d")}
          onChange={(ev) =>
            setSelectedList(
              bookmarks.find((b) => b.tagValue("d") === ev.target.value)
            )
          }
        >
          {bookmarks.map((b) => {
            return <option value={b.tagValue("d")}>{b.tagValue("d")}</option>;
          })}
        </Select>
      </FormControl>
      {selectedList && (
        <List key={selectedList?.tagValue("d")} event={selectedList} isFeed />
      )}
    </Stack>
  );
}
