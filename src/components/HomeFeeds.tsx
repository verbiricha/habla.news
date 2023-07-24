import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { useAtom } from "jotai";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  AvatarGroup,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import KeyIcon from "@habla/icons/Key";
import HashtagIcon from "@habla/icons/Hashtag";
import ListIcon from "@habla/icons/List";
import UsersIcon from "@habla/icons/Users";
import GlobeIcon from "@habla/icons/Globe";

import { LONG_FORM, HIGHLIGHT, DAY, WEEK, MONTH } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  tagsAtom,
  //bookmarksAtom,
  peopleListsAtom,
} from "@habla/state";
import SectionHeading from "@habla/components/SectionHeading";
import Relays from "@habla/components/Relays";
import Hashtags from "@habla/components/Hashtags";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import Feed from "@habla/components/nostr/Feed";
import Avatar from "@habla/components/nostr/Avatar";
import { findTag } from "@habla/tags";
import { useNeedsBackup } from "@habla/onboarding/hooks";

enum Feeds {
  All = "All",
  Tag = "Tag",
  Follows = "Follows",
  PeopleList = "PeopleList",
  Community = "Community",
}

export default function HomeFeeds() {
  const { t } = useTranslation("common");
  const [pubkey] = useAtom(pubkeyAtom);
  const [follows] = useAtom(followsAtom);
  //const [bookmarks] = useAtom(bookmarksAtom);
  const [peopleLists] = useAtom(peopleListsAtom);
  const [list, setList] = useState();
  const [tag, setTag] = useState();
  const [tags] = useAtom(tagsAtom);
  const isLoggedIn = pubkey && follows.length > 0;
  const [kinds, setKinds] = useState([LONG_FORM]);
  const hasFollows = pubkey && follows.length > 0;
  const [feed, setFeed] = useState(hasFollows > 0 ? Feeds.Follows : Feeds.All);
  const needsBackup = useNeedsBackup();
  const router = useRouter();
  const listName = useMemo(() => {
    if (list) {
      return findTag(list, "name") || findTag(list, "d");
    }
    return "";
  }, [list]);
  const listPeople = useMemo(() => {
    if (list) {
      return list.tags.filter((t) => t.at(0) === "p").map((t) => t.at(1));
    }
    return [];
  }, [list]);

  const listDescription = useMemo(() => {
    if (list) return findTag(list, "description");

    return null;
  }, [list]);

  const feedSelector = (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {feed === Feeds.All && t("all")}
        {feed === Feeds.Follows && t("follows")}
        {feed === Feeds.PeopleList && listName}
        {feed === Feeds.Tag && `# ${tag}`}
      </MenuButton>
      <MenuList>
        {hasFollows && (
          <MenuItem
            isDisabled={!isLoggedIn}
            onClick={() => setFeed(Feeds.Follows)}
            icon={<Icon as={UsersIcon} />}
          >
            {t("follows")}
          </MenuItem>
        )}
        {peopleLists.map((e) => {
          const d = findTag(e, "d");
          const onClick = () => {
            setList(e);
            setFeed(Feeds.PeopleList);
          };
          return (
            <MenuItem icon={<Icon as={ListIcon} />} onClick={onClick}>
              {d}
            </MenuItem>
          );
        })}
        {tags.map((t) => {
          const onClick = () => {
            setTag(t);
            setFeed(Feeds.Tag);
          };
          return (
            <MenuItem
              key={t}
              icon={<Icon as={HashtagIcon} />}
              onClick={onClick}
            >
              {t}
            </MenuItem>
          );
        })}
        <MenuItem
          icon={<Icon as={GlobeIcon} />}
          onClick={() => setFeed(Feeds.All)}
        >
          {t("all")}
        </MenuItem>
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
        offset: follows.length < 100 ? 12 * MONTH : MONTH,
      };
    }

    if (feed === Feeds.Tag && tag) {
      return {
        id: `tag-${tag}-${kinds.join("-")}`,
        filter: {
          kinds,
          "#t": [tag],
        },
        offset: MONTH,
      };
    }
    if (feed === Feeds.All) {
      return {
        id: `posts-${pubkey}-${kinds.join("-")}`,
        filter: {
          kinds,
        },
        offset: DAY,
      };
    }

    if (feed === Feeds.PeopleList && listPeople.length > 0) {
      return {
        id: `list-${listName}-${kinds.join("-")}`,
        filter: {
          kinds,
          authors: listPeople,
        },
        offset: 12 * MONTH,
        options: {
          cacheUsage: "RELAY_FIRST",
        },
      };
    }

    return null;
  }, [pubkey, follows, kinds, feed, list, tag]);

  useEffect(() => {
    if (pubkey && hasFollows && feed === Feeds.All) {
      setFeed(Feeds.Follows);
    }
    if (!pubkey && feed === Feeds.Follows) {
      setFeed(Feeds.All);
    }
  }, [pubkey, hasFollows]);

  function setKind(k) {
    setKinds([k]);
  }

  function toggleKind(k) {
    if (kinds.includes(k) && kinds.length > 1) {
      setKinds(kinds.filter((kind) => k !== kind));
    }

    if (!kinds.includes(k)) {
      setKinds(kinds.concat([k]));
    }
  }

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
            onClick={() => setKind(LONG_FORM)}
            fontWeight="normal"
          >
            {t("articles")}
          </Button>
          <Button
            colorScheme={kinds.includes(HIGHLIGHT) ? "purple" : null}
            onClick={() => setKind(HIGHLIGHT)}
            fontWeight="normal"
          >
            {t("highlights")}
          </Button>
        </ButtonGroup>
        {feedSelector}
      </Flex>
      {feed === Feeds.PeopleList && list && (
        <Stack>
          <Flex flexDir={["column", "row"]} justifyContent="space-between">
            <Heading my={0}>{listName}</Heading>
            <AvatarGroup size="sm" max={6} spacing="-0.5rem">
              {listPeople.map((pk) => (
                <Avatar key={pk} pubkey={pk} />
              ))}
            </AvatarGroup>
          </Flex>
          {listDescription && <Text>{listDescription}</Text>}
        </Stack>
      )}
      {filter ? (
        <FeedPage
          key={filter.id}
          filter={filter.filter}
          offset={filter.offset}
          options={filter.options}
        />
      ) : (
        <Text>{t("unknown-filter")}</Text>
      )}
    </>
  );
}
