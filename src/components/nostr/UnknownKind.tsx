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
import { useEvent, useEvents, useUser } from "@habla/nostr/hooks";
import User from "@habla/components/nostr/User";
import People from "@habla/components/nostr/People";
import Brackets from "@habla/icons/Brackets";
import Blockquote from "@habla/components/Blockquote";
import { pubkeyAtom, followsAtom } from "@habla/state";
import { APP, APP_RECOMMENDATION } from "@habla/const";
import { findFullTag, findTags } from "@habla/tags";
import { parseJSON, dedupe } from "@habla/util";

function UnknownKindText({ event }) {
  const { t } = useTranslation("common");
  return (
    <HStack>
      <Icon color="secondary" as={Brackets} boxSize={4} />
      <Text fontFamily="body" fontSize={{ base: "xs", sm: "md" }}>
        {t("unknown-kind", { kind: event.kind })}
      </Text>
    </HStack>
  );
}

export function useAppAddress(address: string) {
  const [, pubkey, d] = useMemo(() => address.split(":"), [address]);
  const event = useEvent(
    {
      kinds: [APP],
      authors: [pubkey],
      "#d": [d],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
    }
  );
  return event ? parseAppInfo(event) : {};
}

export function useClientAddress(event) {
  const address = useMemo(() => {
    const clientTag = findFullTag(event, "client");
    if (!clientTag) {
      return;
    }
    const a = clientTag[1];
    if (!a.startsWith(`${APP}:`)) {
      return;
    }
    return a;
  }, [event]);
  return address;
}

function parseAppInfo(event) {
  const authorTag = event.tags.find(
    (t) => t.at(0) === "p" && t.at(3) === "author"
  );
  const author = authorTag?.at(1) || event.pubkey;
  const appProfile = parseJSON(event.content, null);

  return { author: author, app: appProfile };
}

function AppMenuItem({ event, unknownEvent, recommenders }) {
  const pubkey = useAtomValue(pubkeyAtom);
  const isPreferredApp = useMemo(() => {
    return recommenders.includes(pubkey);
  }, [recommenders, pubkey]);
  const { author: authorPubkey, app } = useMemo(
    () => parseAppInfo(event),
    [event]
  );
  const author = useUser(authorPubkey);
  const profile = app ? app : author;
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
          {(profile.picture || profile.image) && (
            <Image
              width="32px"
              height="32px"
              src={profile.picture || profile.image}
            />
          )}
          {isPreferredApp ? (
            <HStack>
              <Text as="span">{profile.display_name || profile.name}</Text>
              <Icon as={StarIcon} boxSize={3} color="purple.500" />
            </HStack>
          ) : (
            <Text as="span">{profile.display_name || profile.name}</Text>
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
  const { events: reccs } = useEvents(
    {
      kinds: [APP_RECOMMENDATION],
      "#d": [String(event.kind)],
    },
    {
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    }
  );
  const recommendedApps = useMemo(() => {
    return reccs.reduce((acc, ev) => {
      const addresses = findTags(ev, "a").filter((a) =>
        a.startsWith(`${APP}:`)
      );
      for (const address of addresses) {
        const soFar = acc[address] ?? [];
        acc[address] = dedupe(soFar.concat([ev.pubkey]));
      }
      return acc;
    }, {});
  }, [reccs]);

  const filter = useMemo(() => {
    return Object.keys(recommendedApps).reduce(
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
  }, [recommendedApps]);

  const { id, events } = useEvents(filter, {
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });

  const recommended = useMemo(() => {
    return events
      .sort((a, b) => {
        const aRecommendations = recommendedApps[a.tagId()];
        const aNetworkReccomendations = aRecommendations.reduce((acc, pk) => {
          if (pk === pubkey) {
            return acc + 42;
          }
          if (contacts.includes(pk)) {
            return acc + 1;
          }
          return acc;
        }, 0);
        const aScore = aRecommendations.length + aNetworkReccomendations;
        const bRecommendations = recommendedApps[b.tagId()];
        const bNetworkReccomendations = bRecommendations.reduce((acc, pk) => {
          if (pk === pubkey) {
            return acc + 42;
          }
          if (contacts.includes(pk)) {
            return acc + 1;
          }
          return acc;
        }, 0);
        const bScore = bRecommendations.length + bNetworkReccomendations;
        return bScore - aScore;
      })
      .map((ev) => {
        return { ev, recommenders: recommendedApps[ev.tagId()] };
      })
      .slice(0, 10);
  }, [events, recommendedApps]);

  return recommended;
}

export function RecommendedAppMenu({ event }) {
  const { t } = useTranslation("common");
  const recommended = useRecommendedApps(event);
  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        isDisabled={recommended.length === 0}
        size={{ base: "xs", sm: "sm" }}
        rightIcon={<ChevronDownIcon />}
      >
        {t("open-with")}
      </MenuButton>
      <MenuList>
        {recommended.map(({ ev, recommenders }) => (
          <MenuItem>
            <AppMenuItem
              unknownEvent={event}
              event={ev}
              recommenders={recommenders}
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
        <User size="2xs" fontSize="xs" pubkey={event.pubkey} />
      </CardHeader>
      {alt && (
        <CardBody>
          <Blockquote fontSize="md" fontFamily="body">
            {alt}
          </Blockquote>
        </CardBody>
      )}
    </Card>
  );
}
