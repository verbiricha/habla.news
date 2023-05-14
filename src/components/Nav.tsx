import Link from "next/link";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { Flex, IconButton } from "@chakra-ui/react";

import { pubkeyAtom } from "@habla/state";
import ReadIcon from "@habla/icons/Read";
import BookmarkIcon from "@habla/icons/Bookmark";

export default function Nav() {
  const [pubkey] = useAtom(pubkeyAtom);
  const router = useRouter();
  const path = router.pathname;
  const activeNav = {
    bg: "brand.50",
    color: "brand.500",
    borderRadius: "16px",
  };
  const nav = {
    bg: "white",
    color: "black",
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
      <Link href="/">
        <IconButton
          icon={<ReadIcon />}
          aria-label="Read"
          sx={path !== "/bookmarks" ? activeNav : nav}
        />
      </Link>
      <Link href="/bookmarks">
        <IconButton
          icon={<BookmarkIcon />}
          aria-label="Bookmarks"
          sx={path === "/bookmarks" ? activeNav : nav}
        />
      </Link>
    </Flex>
  );
}
