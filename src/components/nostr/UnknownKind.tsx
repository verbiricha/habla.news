import { useMemo } from "react";
import {
  HStack,
  Text,
  Code,
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
import Blockquote from "@habla/components/Blockquote";
import { pubkeyAtom, relaysAtom, followsAtom } from "@habla/state";
import { APP, APP_RECOMMENDATION } from "@habla/const";
import { findTags } from "@habla/tags";
import { parseJSON, dedupe } from "@habla/util";

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
              <Text>{appProfile.display_name || appProfile.name}</Text>
              <Icon as={StarIcon} boxSize={3} color="purple.500" />
            </HStack>
          ) : (
            <Text>{appProfile.display_name || appProfile.name}</Text>
          )}
        </HStack>
        <People sx={{ pointerEvents: "none" }} pubkeys={recommenders} />
      </HStack>
    </MenuItem>
  );
}

function Recommendations({ event, recommendations }) {
  const { t } = useTranslation("common");
  const addresses = Object.keys(recommendations);
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
    closeOnEose: true,
    groupable: false,
    cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
  });
  const recommended = useMemo(() => {
    return events.sort((a, b) => {
      return (
        recommendations[b.tagId()].length - recommendations[a.tagId()].length
      );
    });
  }, [events, recommendations]);

  const alt = event.tagValue("alt");

  return (
    <Card>
      <CardHeader>
        <HStack align="center" justify="space-between">
          <Text>{t("unknown-kind", { kind: event.kind })}</Text>
          <Menu isLazy>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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

export default function UnknownKind({ event }) {
  const contacts = useAtomValue(followsAtom);
  const pubkey = useAtomValue(pubkeyAtom);
  const relays = useAtomValue(relaysAtom);
  const { events: networkRecommendations } = useEvents(
    {
      kinds: [APP_RECOMMENDATION],
      authors: pubkey ? contacts.concat([pubkey]) : contacts,
      "#d": [event.kind],
    },
    {
      disable: contacts.length === 0 && !pubkey,
      relays: relays.concat(["wss://relay.nostr.band"]),
      closeOnEose: true,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL,
    }
  );
  const recommendedApps = useMemo(() => {
    return networkRecommendations.reduce((acc, ev) => {
      const addresses = findTags(ev, "a").filter((a) =>
        a.startsWith(`${APP}:`)
      );
      for (const address of addresses) {
        const soFar = acc[address] ?? [];
        acc[address] = dedupe(soFar.concat([ev.pubkey]));
      }
      return acc;
    }, {});
  }, [networkRecommendations]);
  const recommendationsAmount = Object.keys(recommendedApps).length;
  const canShowRecommendations = recommendationsAmount > 0;

  if (canShowRecommendations) {
    return (
      <Recommendations
        key={recommendationsAmount}
        event={event}
        recommendations={recommendedApps}
      />
    );
  }

  const alt = findTag(event, "alt");
  return alt ? <Text>{alt}</Text> : null;
}
