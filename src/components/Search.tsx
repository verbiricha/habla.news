import { useState } from "react";

import { Stack, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

import SearchFeed from "@habla/components/nostr/feed/SearchFeed";

export default function Search({ relays }) {
  const [query, setQuery] = useState("");
  return (
    <Stack gap={2}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
      <SearchFeed query={query} relays={relays} />
    </Stack>
  );
}
