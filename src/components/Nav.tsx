import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import {
  useColorModeValue,
  Flex,
  IconButton,
  Box,
  Text,
} from "@chakra-ui/react";

import { pubkeyAtom } from "@habla/state";
import ReadIcon from "@habla/icons/Read";
import BookmarkIcon from "@habla/icons/Bookmark";
import SearchIcon from "@habla/icons/Search";
import CommunitiesIcon from "@habla/icons/Community";

export default function Nav() {
  const { t } = useTranslation("common");
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
    display: ["none", "none", "none", "none", "block"],
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
          aria-label={t("nav-read")}
          sx={navIcon}
        />
        <Text sx={navLinkText}>{t("nav-read")}</Text>
      </Box>
      <Box as={Link} href="/search" sx={getLinkSX("/search")} shallow>
        <IconButton
          icon={<SearchIcon />}
          aria-label={t("nav-search")}
          sx={navIcon}
        />
        <Text sx={navLinkText}>{t("nav-search")}</Text>
      </Box>
      <Box as={Link} href="/c" sx={getLinkSX("/c")} shallow>
        <IconButton
          icon={<CommunitiesIcon />}
          aria-label={t("nav-communities")}
          sx={navIcon}
        />
        <Text sx={navLinkText}>{t("nav-communities")}</Text>
      </Box>
      <Box as={Link} href="/bookmarks" sx={getLinkSX("/bookmarks")} shallow>
        <IconButton
          aria-label={t("nav-bookmarks")}
          icon={<BookmarkIcon />}
          sx={navIcon}
        />
        <Text sx={navLinkText}>{t("nav-bookmarks")}</Text>
      </Box>
    </Flex>
  );
}
