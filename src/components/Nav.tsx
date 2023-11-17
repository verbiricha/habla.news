import Link from "next/link";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { useColorModeValue, Flex, IconButton, Box, Text } from "@chakra-ui/react";

import { pubkeyAtom } from "@habla/state";
import ReadIcon from "@habla/icons/Read";
import BookmarkIcon from "@habla/icons/Bookmark";
import SearchIcon from "@habla/icons/Search";
import CommunitiesIcon from "@habla/icons/Community";

export default function Nav() {
  const [pubkey] = useAtom(pubkeyAtom);
  const router = useRouter();
  const path = router.pathname;
  // todo: extract to theme
  const bg = useColorModeValue("brand.50", "#3B3B3D");
  const color = useColorModeValue("brand.500", "#B196FF");
  const navLink = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "2",
    borderRadius: "16px",
    transition: "background-color 0.2s ease-in-out",
  };
  const navLinkText = {
    display: ["none", "none", "none", "none", "block"]
  };
  const activeNav = {
    ...navLink,
    bg,
    "& svg, & p": { color },
  };
  const nav = {
    ...navLink,
    bg: "transparent",
  };
  const navIcon = {
    "&:hover": { bg: "transparent" },
    bg: "transparent",
  };
  const getLinkSX = (checkPath: string) => {
    if (path === checkPath) {
      return activeNav;
    } else {
      return {
        ...nav,
        "&:hover": { bg: bg },
      };
    }
  };
  return (
    <Flex
      flexDirection={["row", "row", "column"]}
      gap={4}
      mx={[4, 4, 0]}
      my={[0, 0, 4]}
      px={[0, 0, 4, 4]}
    >
      <Box as={Link} href="/" sx={getLinkSX("/")} shallow>
        <IconButton
          icon={<ReadIcon />}
          aria-label="Read"
          sx={navIcon}
        />
        <Text sx={navLinkText}>Read</Text>
      </Box>
      <Box as={Link} href="/search" sx={getLinkSX("/search")} shallow>
        <IconButton
          icon={<SearchIcon />}
          aria-label="Search"
          sx={navIcon}
        />
        <Text sx={navLinkText}>Search</Text>
      </Box>
      <Box as={Link} href="/c" sx={getLinkSX("/c")} shallow>
        <IconButton
          icon={<CommunitiesIcon />}
          aria-label="Communities"
          sx={navIcon}
        />
        <Text sx={navLinkText}>Communities</Text>
      </Box>
      <Box as={Link} href="/bookmarks" sx={getLinkSX("/bookmarks")} shallow>
        <IconButton
          aria-label="Bookmarks"
          icon={<BookmarkIcon />}
          sx={navIcon}
        />
        <Text sx={navLinkText}>Bookmarks</Text>
      </Box>
    </Flex>
  );
}
