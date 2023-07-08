import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";

import { useAtom } from "jotai";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Button,
  ButtonGroup,
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

import { LONG_FORM, HIGHLIGHT, DAY, WEEK, MONTH } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  //bookmarksAtom,
  peopleListsAtom,
} from "@habla/state";
import SectionHeading from "@habla/components/SectionHeading";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import Feed from "@habla/components/nostr/Feed";
import Avatar from "@habla/components/nostr/Avatar";
import { findTag } from "@habla/tags";

enum Feeds {
  All = "All",
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
  const isLoggedIn = pubkey && follows.length > 0;
  const [kinds, setKinds] = useState([LONG_FORM]);
  const [feed, setFeed] = useState(pubkey ? Feeds.Follows : Feeds.All);
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
      </MenuButton>
      <MenuList fontFamily="'Inter'">
        <MenuItem
          isDisabled={!isLoggedIn}
          onClick={() => setFeed(Feeds.Follows)}
        >
          {t("follows")}
        </MenuItem>
        <MenuItem onClick={() => setFeed(Feeds.All)}>{t("all")}</MenuItem>
        {peopleLists.map((e) => {
          const d = findTag(e, "d");
          const onClick = () => {
            setList(e);
            setFeed(Feeds.PeopleList);
          };
          return <MenuItem onClick={onClick}>{d}</MenuItem>;
        })}
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
        offset: WEEK,
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
        offset: WEEK,
      };
    }

    return null;
  }, [pubkey, follows, kinds, feed, list]);

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
      <Flex flexDir={["column", "row"]} justifyContent="space-between" gap={4}>
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
        />
      ) : (
        <Text>Unknown filter</Text>
      )}
    </>
  );
}
