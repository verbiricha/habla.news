import Link from "next/link";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { useColorModeValue, Flex, IconButton } from "@chakra-ui/react";

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
  const activeNav = {
    bg,
    color,
    borderRadius: "16px",
  };
  const nav = {
    bg: "transparent",
    borderRadius: "16px",
  };
  return (
    <Flex
      flexDirection={["row", "row", "column"]}
      align="center"
      gap={4}
      mx={[4, 4, 0]}
      my={[0, 0, 4]}
    >
      <Link href="/" shallow>
        <IconButton
          icon={<ReadIcon />}
          aria-label="Read"
          sx={path === "/" ? activeNav : nav}
        />
      </Link>
      {/*
      <Link href="/bookmarks">
        <IconButton
          icon={<BookmarkIcon />}
          aria-label="Bookmarks"
          sx={path === "/bookmarks" ? activeNav : nav}
        />
      </Link>
      */}
      <Link href="/search" shallow>
        <IconButton
          icon={<SearchIcon />}
          aria-label="Search"
          sx={path === "/search" ? activeNav : nav}
        />
      </Link>
      <Link href="/c/" shallow>
        <IconButton
          icon={<CommunitiesIcon />}
          aria-label="Communities"
          sx={path === "/c" ? activeNav : nav}
        />
      </Link>
    </Flex>
  );
}
