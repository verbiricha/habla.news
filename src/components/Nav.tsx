import { Flex, IconButton } from "@chakra-ui/react";

import ReadIcon from "@habla/icons/Read";
import BookmarkIcon from "@habla/icons/Bookmark";

export default function Nav() {
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
      <IconButton {...activeNav} icon={<ReadIcon />} aria-label="Read" />
      <IconButton {...nav} icon={<BookmarkIcon />} aria-label="Bookmarks" />
    </Flex>
  );
}
