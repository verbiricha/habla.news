import Link from "next/link";

import { Box, Flex, Tag } from "@chakra-ui/react";

export default function Hashtags({ hashtags, ...rest }) {
  return (
    <Flex flexWrap="wrap">
      {hashtags.map((t) => (
        <Box key={t} m={2} ml={0}>
          <Tag size="md" {...rest}>
            <Link href={`/t/${t}`}>{t}</Link>
          </Tag>
        </Box>
      ))}
    </Flex>
  );
}
