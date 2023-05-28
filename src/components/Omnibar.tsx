import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/navigation";
import throttle from "lodash/throttle";
import {
  Stack,
  Heading,
  Text,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { nip05, nip19 } from "nostr-tools";

import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import { urlsToNip27 } from "@habla/nip27";
import Feed from "@habla/components/nostr/Feed";

export default function Omnibar() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [event, setEvent] = useState();
  const [search, setSearch] = useState("");

  const onSearchChange = useCallback(
    throttle(async () => {
      const newContent = urlsToNip27(search).replace(/^nostr:/, "");

      try {
        const decoded = nip19.decode(newContent);
        if (decoded?.type === "npub") {
          return await router.push(`/p/${newContent}`);
        } else if (decoded?.type === "nprofile") {
          return await router.push(`/p/${newContent}`);
        } else if (decoded?.type === "note") {
          return await router.push(`/n/${newContent}`);
        } else if (decoded?.type === "nevent") {
          return await router.push(`/e/${newContent}`);
        } else if (decoded?.type === "naddr") {
          return await router.push(`/a/${newContent}`);
        } else if (decoded?.type === "nrelay") {
          return await router.push(`/r/${newContent}`);
        }
      } catch (error) {}

      try {
        const profile = await nip05.queryProfile(newContent);
        if (profile) {
          if (profile.relays.length) {
            const nprofile = nip19.nprofileEncode(profile);
            return await router.push(`/p/${nprofile}`);
          } else {
            const npub = nip19.npubEncode(profile.pubkey);
            return await router.push(`/p/${npub}`);
          }
        }
      } catch (error) {}
    }, 500),
    [search]
  );

  useEffect(() => {
    onSearchChange();
  }, [search]);

  return (
    <Stack gap={2}>
      <Heading>{t("search")}</Heading>
      <Text>{t("search-description")}</Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="secondary" />
        </InputLeftElement>
        <Input
          autoFocus
          placeholder={t("search-placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      // todo: add when it works
      {false && search?.length > 2 && (
        <Feed
          key={search}
          filter={{ kinds: [LONG_FORM, HIGHLIGHT], search, limit: 50 }}
          options={{
            cacheUsage: "RELAY_ONLY",
            closeOnEose: true,
            relays: ["wss://relay.nostr.band"],
          }}
        />
      )}
    </Stack>
  );
}
