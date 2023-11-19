import { useMemo } from "react";
import {
  HStack,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardHeader,
  CardBody,
  Button,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon, StarIcon } from "@chakra-ui/icons";
import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { findTag } from "@habla/tags";
import { useEvents, useUser } from "@habla/nostr/hooks";
import People from "@habla/components/nostr/People";
import Brackets from "@habla/icons/Brackets";
import Blockquote from "@habla/components/Blockquote";
import { pubkeyAtom, relaysAtom, followsAtom } from "@habla/state";
import { APP, APP_RECOMMENDATION } from "@habla/const";
import { findTags } from "@habla/tags";
import { parseJSON, dedupe } from "@habla/util";

function UnknownKindText({ event }) {
  const { t } = useTranslation("common");
  return (
    <HStack>
      <Icon color="secondary" as={Brackets} boxSize={4} />
      <Text fontFamily="body" fontSize="md">
        {t("unknown-kind", { kind: event.kind })}
      </Text>
    </HStack>
  );
}

function AppMenuItem({ event, unknownEvent, recommenders }) {
  const pubkey = useAtomValue(pubkeyAtom);
  const isPreferredApp = useMemo(() => {
    return recommenders.includes(pubkey);
  }, [recommenders, pubkey]);
  const authorPubkey = useMemo(() => {
    const authorTag = event.tags.find(
      (t) => t.at(0) === "p" && t.at(3) === "author"
    );
    return authorTag?.at(1) || event.pubkey;
  }, [event]);
  const author = useUser(authorPubkey);
  const appProfile = useMemo(() => {
    return parseJSON(event.content, author);
  }, [event, author]);
  const markers = unknownEvent.isParamReplaceable()
    ? ["", "naddr", "nevent"]
    : ["", "note", "nevent"];
  const handler = event.tags.find((t) => markers.includes(t[2]));
  const url = useMemo(() => {
    if (handler) {
      const template = handler[1];
      return template.replace("<bech32>", unknownEvent.encode());
    }
  }, [handler]);

  function onClick(ev) {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <MenuItem isDisabled={!url} onClick={onClick}>
      <HStack w="100%" gap={8} justify="space-between">
        <HStack>
          {appProfile.picture && (
            <Image width="32px" height="32px" src={appProfile.picture} />
          )}
          {isPreferredApp ? (
            <HStack>
              <Text as="span">
                {appProfile.display_name || appProfile.name}
              </Text>
              <Icon as={StarIcon} boxSize={3} color="purple.500" />
            </HStack>
          ) : (
            <Text as="span">{appProfile.display_name || appProfile.name}</Text>
          )}
        </HStack>
        <People sx={{ pointerEvents: "none" }} max={3} pubkeys={recommenders} />
      </HStack>
    </MenuItem>
  );
}

function useRecommendedApps(event) {
  const contacts = useAtomValue(followsAtom);
  const pubkey = useAtomValue(pubkeyAtom);
  const { events, eose } = useEvents(
    {
      kinds: [APP_RECOMMENDATION],
      authors: pubkey ? contacts.concat([pubkey]) : contacts,
      "#d": [event.kind],
    },
    {
      relays: ["wss://relay.nostr.band"],
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    }
  );
  const recommendedApps = useMemo(() => {
    return events.reduce((acc, ev) => {
      const addresses = findTags(ev, "a").filter((a) =>
        a.startsWith(`${APP}:`)
      );
      for (const address of addresses) {
        const soFar = acc[address] ?? [];
        acc[address] = dedupe(soFar.concat([ev.pubkey]));
      }
      return acc;
    }, {});
  }, [events]);

  return { recommendedApps, eose };
}

export function RecommendedAppMenu({ event }) {
  const { t } = useTranslation("common");
  const { recommendedApps: recommendations, eose } = useRecommendedApps(event);
  const addresses = Object.keys(recommendations);
  const relays = useAtomValue(relaysAtom);
  const filter = useMemo(() => {
    return addresses.reduce(
      (acc, a) => {
        const [, pubkey, d] = a.split(":");
        acc.authors.push(pubkey);
        acc["#d"].push(d);
        return acc;
      },
      {
        kinds: [APP],
        authors: [],
        "#d": [],
      }
    );
  }, [addresses]);
  const { events } = useEvents(filter, {
    disable: !eose,
    relays: ["wss://relay.nostr.band"],
    closeOnEose: true,
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });
  const recommended = useMemo(() => {
    return events
      .sort((a, b) => {
        return (
          recommendations[b.tagId()].length - recommendations[a.tagId()].length
        );
      })
      .slice(0, 5);
  }, [events, recommendations]);

  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        isDisabled={recommended.length === 0}
        size="sm"
        rightIcon={<ChevronDownIcon />}
      >
        {t("open-with")}
      </MenuButton>
      <MenuList>
        {recommended.map((r) => (
          <MenuItem>
            <AppMenuItem
              key={event.id}
              unknownEvent={event}
              event={r}
              recommenders={recommendations[r.tagId()]}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default function UnknownKind({ event }) {
  const alt = event.tagValue("alt");

  return (
    <Card>
      <CardHeader>
        <HStack align="center" justify="space-between">
          <UnknownKindText event={event} />
          <RecommendedAppMenu event={event} />
        </HStack>
      </CardHeader>
      {alt && (
        <CardBody>
          <Blockquote>{alt}</Blockquote>
        </CardBody>
      )}
    </Card>
  );
}
