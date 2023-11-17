import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/navigation";
import throttle from "lodash/throttle";
import {
  useDisclosure,
  Spinner,
  Stack,
  Heading,
  Text,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Button,
} from "@chakra-ui/react";
import { nip05, nip19 } from "nostr-tools";

import { LONG_FORM, HIGHLIGHT, HASHTAG_REGEX } from "@habla/const";
import { urlsToNip27 } from "@habla/nip27";
import Feed from "@habla/components/nostr/feed/Feed";
import SearchIcon from "@habla/icons/Search";

export default function Omnibar() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [event, setEvent] = useState();
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [tags, setTags] = useState([]);
  const isTagSearch = tags?.length > 0;

  const onSearch = useCallback(async () => {
    const newContent = urlsToNip27(query).replace(/^nostr:/, "");

    // NIP-19 identifiers
    try {
      const decoded = nip19.decode(newContent);
      if (decoded?.type === "npub") {
        return await router.push(`/p/${newContent}`, undefined, {
          shallow: true,
        });
      } else if (decoded?.type === "nprofile") {
        return await router.push(`/p/${newContent}`, undefined, {
          shallow: true,
        });
      } else if (decoded?.type === "note") {
        return await router.push(`/n/${newContent}`, undefined, {
          shallow: true,
        });
      } else if (decoded?.type === "nevent") {
        return await router.push(`/e/${newContent}`, undefined, {
          shallow: true,
        });
      } else if (decoded?.type === "naddr") {
        return await router.push(`/a/${newContent}`, undefined, {
          shallow: true,
        });
      } else if (decoded?.type === "nrelay") {
        return await router.push(`/r/${newContent}`, undefined, {
          shallow: true,
        });
      }
    } catch (error) {}

    // NIP-05
    try {
      onOpen();
      const profile = await nip05.queryProfile(newContent);
      if (profile) {
        return await router.push(`/u/${newContent}`, undefined, {
          shallow: true,
        });
      }
    } catch (error) {
    } finally {
      onClose();
    }

    // Hashtags
    const hashtags = newContent.match(HASHTAG_REGEX);
    if (hashtags) {
      setTags(hashtags.map((t) => t.slice(1)));
    }

    setSearchTerm(newContent);
  }, [query]);

  return (
    <Stack gap={2}>
      <Heading>{t("search")}</Heading>
      <Text>{t("search-description")}</Text>
      <Text>{t("search-more")}</Text>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {isOpen ? (
            <Spinner size="xs" color="secondary" />
          ) : (
            <Icon as={SearchIcon} color="secondary" />
          )}
        </InputLeftElement>
        <Input
          pr="4.5rem"
          autoFocus
          placeholder={t("search-placeholder")}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            isDisabled={searchTerm === query}
            h="1.75rem"
            size="sm"
            mr="0.5rem"
            onClick={onSearch}
          >
            {t("search")}
          </Button>
        </InputRightElement>
      </InputGroup>
      {isTagSearch && searchTerm && (
        <Feed
          key={tags.join("")}
          limit={10}
          filter={{ kinds: [LONG_FORM], "#t": tags }}
        />
      )}
      {!isTagSearch && searchTerm && (
        <Feed
          key={searchTerm}
          limit={10}
          filter={{ kinds: [LONG_FORM], search: searchTerm }}
        />
      )}
    </Stack>
  );
}
