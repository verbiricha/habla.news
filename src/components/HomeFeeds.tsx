import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";

import { useAtom } from "jotai";
import {
  Flex,
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
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { LONG_FORM, HIGHLIGHT, DAY, WEEK } from "@habla/const";
import {
  pubkeyAtom,
  followsAtom,
  bookmarksAtom,
  peopleListsAtom,
} from "@habla/state";
import SectionHeading from "@habla/components/SectionHeading";
import Tabs from "@habla/components/Tabs";
import Relays from "@habla/components/Relays";
import FeedPage from "@habla/components/nostr/feed/FeedPage";
import Feed from "@habla/components/nostr/Feed";

enum Feeds {
  All = "All",
  Follows = "Follows",
  PeopleList = "PeopleList",
  Community = "Community",
}

// todo: people lists, pinned communnities

export default function HomeFeeds() {
  const { t } = useTranslation("common");
  const [pubkey] = useAtom(pubkeyAtom);
  const [follows] = useAtom(followsAtom);
  const [bookmarks] = useAtom(bookmarksAtom);
  const [peopleLists] = useAtom(peopleListsAtom);
  const isLoggedIn = pubkey && follows.length > 0;
  const [kinds, setKinds] = useState([LONG_FORM]);
  const [feed, setFeed] = useState(pubkey ? Feeds.Follows : Feeds.All);
  const feedSelector = (
    <Flex justifyContent="flex-end" width="100%">
      <Menu isLazy>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {feed === Feeds.All && t("all")}
          {feed === Feeds.Follows && t("follows")}
        </MenuButton>
        <MenuList fontFamily="'Inter'">
          <MenuItem
            isDisabled={!isLoggedIn}
            onClick={() => setFeed(Feeds.Follows)}
          >
            {t("follows")}
          </MenuItem>
          <MenuItem onClick={() => setFeed(Feeds.All)}>{t("all")}</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
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

    return null;
  }, [pubkey, follows, kinds, feed]);

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
      <Flex>
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
      {filter && (
        <FeedPage
          key={filter.id}
          filter={filter.filter}
          offset={filter.offset}
        />
      )}
    </>
  );
}
