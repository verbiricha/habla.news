import { useState } from "react";

import { useTranslation } from "next-i18next";
import {
  Stack,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import SearchFeed from "@habla/components/nostr/feed/SearchFeed";

export default function Search({ relays }) {
  const { t } = useTranslation("common");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState();
  return (
    <Stack gap={2}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            isDisabled={searchTerm === query}
            h="1.75rem"
            size="sm"
            mr="0.5rem"
            onClick={() => setSearchTerm(query)}
          >
            {t("search")}
          </Button>
        </InputRightElement>
      </InputGroup>
      {searchTerm && <SearchFeed query={searchTerm} relays={relays} />}
    </Stack>
  );
}
