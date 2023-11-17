import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { Heading, Text, Input } from "@chakra-ui/react";

import { useEvents } from "@habla/nostr/hooks";
import Community from "@habla/components/nostr/feed/Community";
import { COMMUNITY } from "@habla/const";
import { communitiesAtom } from "@habla/state";
import { findTag } from "@habla/tags";
import { getMetadata } from "@habla/nip72";

export default function Communities() {
  const { t } = useTranslation();
  const [communities] = useAtom(communitiesAtom);
  const [query, setQuery] = useState("");
  const { events } = useEvents({
    kinds: [COMMUNITY],
  });
  const followedCommunities = useMemo(() => {
    return (
      communities?.tags.filter(
        (t) => t.at(0) === "a" && t.at(1)?.startsWith(`${COMMUNITY}:`)
      ) || []
    );
  }, [communities]);
  const myCommunities = useMemo(() => {
    return followedCommunities
      .map((t) => {
        const [_, pubkey, d] = t.at(1).split(":");
        return events.find((e) => e.pubkey === pubkey && findTag(e, "d") === d);
      })
      .filter((c) => c);
  }, [events, followedCommunities]);
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const term = query.toLowerCase();
      const { name, description } = getMetadata(e);
      return (
        name.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term)
      );
    });
  }, [events, query]);
  return (
    <>
      <Heading>{t("communities")}</Heading>
      <Heading as="h3" fontSize="2xl">
        {t("my-communities")}
      </Heading>
      {myCommunities.length === 0 && <Text>{t("follow-communities")}</Text>}
      {myCommunities.map((c) => (
        <Community key={c.id} event={c} />
      ))}
      <Heading as="h3" fontSize="2xl">
        {t("browse-communities")}
      </Heading>
      <Input
        autoFocus
        placeholder={t("search-communities-placeholder")}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredEvents.map((c) => (
        <Community key={`browse-${c.id}`} event={c} />
      ))}
    </>
  );
}
