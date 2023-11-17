import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { NDKSubscriptionCacheUsage } from "@nostr-dev-kit/ndk";

import { useAtom } from "jotai";
import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Icon,
  Menu,
  MenuGroup,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuOptionGroup,
  MenuDivider,
  AvatarGroup,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { featuredPubkeys } from "@habla/nip05";
import KeyIcon from "@habla/icons/Key";
import HashtagIcon from "@habla/icons/Hashtag";
import ListIcon from "@habla/icons/List";
import UsersIcon from "@habla/icons/Users";
import RelayIcon from "@habla/icons/Relay";
import GlobeIcon from "@habla/icons/Globe";
import HeartIcon from "@habla/icons/Heart";
import { LONG_FORM, HIGHLIGHT } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  tagsAtom,
  peopleListsAtom,
  relaysAtom,
} from "@habla/state";
import SectionHeading from "@habla/components/SectionHeading";
import RelayFavicon from "@habla/components/RelayFavicon";
import Hashtags from "@habla/components/Hashtags";
import Feed from "@habla/components/nostr/feed/Feed";
import Avatar from "@habla/components/nostr/Avatar";
import User from "@habla/components/nostr/User";
import { findTag, findTags } from "@habla/tags";
import { useNeedsBackup } from "@habla/onboarding/hooks";
import useRelayMetadata from "@habla/hooks/useRelayMetadata";
import { toPubkey } from "@habla/util";

enum Feeds {
  Featured = "Featured",
  All = "All",
  Tag = "Tag",
  Follows = "Follows",
  PeopleList = "PeopleList",
  //Community = "Community",
  Relay = "Relay",
}

function feedIcon(f: Feeds) {
  if (f === Feeds.All) {
    return <Icon as={GlobeIcon} />;
  } else if (f === Feeds.Featured) {
    return <Icon as={HeartIcon} />;
  } else if (f === Feeds.Tag) {
    return <Icon as={HashtagIcon} />;
  } else if (f === Feeds.Follows) {
    return <Icon as={UsersIcon} />;
  } else if (f === Feeds.PeopleList) {
    return <Icon as={ListIcon} />;
  } else if (f === Feeds.Relay) {
    return <Icon as={RelayIcon} />;
  }
}

function RelayHeading({ url }) {
  const { data } = useRelayMetadata(url);
  const operator = useMemo(() => {
    return toPubkey(data?.pubkey);
  }, [data]);
  return (
    <Flex
      align={["flex-start", "center"]}
      flexDir={["column", "row"]}
      justifyContent="space-between"
      gap={2}
    >
      <Stack align="center" direction="row" gap={3} wordBreak="break-word">
        <RelayFavicon url={url} size={["sm", "md"]} />
        <Heading textOverflow="ellipsis" fontSize={["xl", "2xl"]}>
          {data?.name || url}
        </Heading>
      </Stack>
      {operator && (
        <User
          key={operator}
          pubkey={operator}
          size={["xs", "sm"]}
          fontSize={["xs", "sm"]}
        />
      )}
    </Flex>
  );
}

function ListHeading({ name, list }) {
  const listPeople = useMemo(() => {
    if (list) {
      return findTags(list, "p");
    }
    return [];
  }, [list]);
  const listDescription = useMemo(() => {
    if (list) return findTag(list, "description");

    return null;
  }, [list]);

  return (
    <Stack>
      <Flex flexDir={["column", "row"]} justifyContent="space-between">
        <Heading textOverflow="ellipsis" fontSize={["xl", "2xl"]}>
          {name}
        </Heading>
        <AvatarGroup size="sm" max={6} spacing="-0.5rem">
          {listPeople.map((pk) => (
            <Avatar key={pk} pubkey={pk} />
          ))}
        </AvatarGroup>
      </Flex>
      {listDescription && <Text>{listDescription}</Text>}
    </Stack>
  );
}

export default function HomeFeeds() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [pubkey] = useAtom(pubkeyAtom);
  const [follows] = useAtom(followsAtom);
  const [peopleLists] = useAtom(peopleListsAtom);
  const [list, setList] = useState();
  const [tag, setTag] = useState();
  const [relay, setRelay] = useState();
  const [relays] = useAtom(relaysAtom);
  const [tags] = useAtom(tagsAtom);
  const isLoggedIn = pubkey && follows.length > 0;
  const [kinds, setKinds] = useState([LONG_FORM]);
  const hasFollows = pubkey && follows.length > 0;
  const [feed, setFeed] = useState(hasFollows ? Feeds.Follows : Feeds.Featured);
  const needsBackup = useNeedsBackup();
  const lists = useMemo(() => {
    return Object.entries(peopleLists);
  }, [peopleLists]);
  const listName = useMemo(() => {
    if (list) {
      return findTag(list, "title") || findTag(list, "d");
    }
    return "";
  }, [list]);
  const listPeople = useMemo(() => {
    if (list) {
      return findTags(list, "p");
    }
    return [];
  }, [list]);

  const feedSelector = (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {feed !== Feeds.Relay && (
          <Flex align="center" gap={2}>
            {feedIcon(feed)}
            <Text>
              {feed === Feeds.Featured && t("featured")}
              {feed === Feeds.All && t("all")}
              {feed === Feeds.Follows && t("follows")}
              {feed === Feeds.PeopleList && listName}
              {feed === Feeds.Tag && `# ${tag}`}
            </Text>
          </Flex>
        )}
        {feed === Feeds.Relay && (
          <Flex align="center" gap={2}>
            <RelayFavicon size="2xs" includeTooltip={false} url={relay} />
            <Text>{relay}</Text>
          </Flex>
        )}
      </MenuButton>
      <MenuList>
        <MenuGroup title={t("people")}>
          {hasFollows && (
            <MenuItem
              isDisabled={!isLoggedIn}
              onClick={() => setFeed(Feeds.Follows)}
              icon={feedIcon(Feeds.Follows)}
            >
              {t("follows")}
            </MenuItem>
          )}
          <MenuItem
            icon={feedIcon(Feeds.Featured)}
            onClick={() => setFeed(Feeds.Featured)}
          >
            {t("featured")}
          </MenuItem>
        </MenuGroup>
        {lists.length > 0 && (
          <>
            <MenuDivider />
            <MenuGroup title={t("lists")}>
              {lists.map(([d, e]) => {
                const onClick = () => {
                  setList(e);
                  setFeed(Feeds.PeopleList);
                };
                return (
                  <MenuItem
                    key={d}
                    icon={feedIcon(Feeds.PeopleList)}
                    onClick={onClick}
                  >
                    {findTag(e, "title") || d}
                  </MenuItem>
                );
              })}
            </MenuGroup>
          </>
        )}
        {tags.length > 0 && (
          <>
            <MenuDivider />
            <MenuGroup title={t("tags")}>
              {tags.map((t) => {
                const onClick = () => {
                  setTag(t);
                  setFeed(Feeds.Tag);
                };
                return (
                  <MenuItem
                    key={t}
                    icon={feedIcon(Feeds.Tag)}
                    onClick={onClick}
                  >
                    {t}
                  </MenuItem>
                );
              })}
            </MenuGroup>
          </>
        )}
        <>
          <MenuDivider />
          <MenuGroup title={t("Relays")}>
            <MenuItem
              key="global"
              icon={feedIcon(Feeds.All)}
              onClick={() => setFeed(Feeds.All)}
            >
              {t("all")}
            </MenuItem>
            {relays.map((r) => {
              const onClick = () => {
                setRelay(r);
                setFeed(Feeds.Relay);
              };
              return (
                <MenuItem
                  key={r}
                  icon={<RelayFavicon size="2xs" url={r} />}
                  onClick={onClick}
                >
                  {r}
                </MenuItem>
              );
            })}
          </MenuGroup>
        </>
      </MenuList>
    </Menu>
  );

  const filter = useMemo(() => {
    if (feed === Feeds.Follows && follows.length > 0) {
      return {
        id: `follows-${pubkey}-${kinds.join("-")}`,
        filter: {
          kinds,
          authors: follows,
        },
      };
    }

    if (feed === Feeds.Tag && tag) {
      return {
        id: `tag-${tag}-${kinds.join("-")}`,
        filter: {
          kinds,
          "#t": [tag],
        },
        limit: 21,
        options: {
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        },
      };
    }

    if (feed === Feeds.Featured) {
      return {
        id: `featured-${kinds.join("-")}`,
        filter: {
          kinds,
          authors: featuredPubkeys,
        },
        limit: 5,
      };
    }

    if (feed === Feeds.All) {
      return {
        id: `global-${kinds.join("-")}`,
        filter: {
          kinds,
        },
        options: {
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        },
      };
    }

    if (feed === Feeds.PeopleList && listPeople.length > 0) {
      return {
        id: `list-${listName}-${kinds.join("-")}`,
        filter: {
          kinds,
          authors: listPeople,
        },
      };
    }

    if (feed === Feeds.Relay && relay) {
      return {
        id: `${relay}-${kinds.join("-")}`,
        filter: {
          kinds,
        },
        limit: 21,
        options: {
          relays: [relay],
          cacheUsage: NDKSubscriptionCacheUsage.ONLY_RELAY,
        },
      };
    }
    return null;
  }, [pubkey, follows, kinds, feed, list, tag, relay]);

  useEffect(() => {
    if (pubkey && hasFollows && feed === Feeds.Featured) {
      setFeed(Feeds.Follows);
    }
    if (!pubkey && feed === Feeds.Follows) {
      setFeed(Feeds.Featured);
    }
  }, [pubkey, hasFollows]);

  return (
    <>
      {needsBackup && (
        <Flex borderRadius="20px" bg="rgba(217, 161, 51, 0.10)" p={4} gap={4}>
          <Icon as={KeyIcon} boxSize={5} />
          <Flex flexDir="column" gap={4}>
            <Stack spacing={3}>
              <Heading fontSize="lg">{t("backup-keys")}</Heading>
              <Text>{t("backup-keys-descr")}</Text>
              <Button
                maxW="160px"
                variant="dark"
                size="xs"
                onClick={() =>
                  router.push("/onboarding/backup", null, { shallow: true })
                }
              >
                {t("backup")}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      )}
      <Flex
        key={pubkey}
        flexDir={["column", "row"]}
        justifyContent="space-between"
        gap={4}
      >
        <ButtonGroup>
          <Button
            colorScheme={kinds.includes(LONG_FORM) ? "purple" : null}
            onClick={() => setKinds([LONG_FORM])}
            fontWeight="normal"
          >
            {t("articles")}
          </Button>
          <Button
            colorScheme={kinds.includes(HIGHLIGHT) ? "purple" : null}
            onClick={() => setKinds([HIGHLIGHT])}
            fontWeight="normal"
          >
            {t("highlights")}
          </Button>
        </ButtonGroup>
        {feedSelector}
      </Flex>
      {feed === Feeds.PeopleList && list && (
        <ListHeading name={listName} list={list} />
      )}
      {feed === Feeds.Relay && relay && <RelayHeading url={relay} />}
      {filter ? (
        <Feed
          key={filter.id}
          filter={filter.filter}
          options={filter.options}
          limit={filter.limit}
        />
      ) : (
        <Text>{t("unknown-filter")}</Text>
      )}
    </>
  );
}
