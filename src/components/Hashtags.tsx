import Link from "next/link";

import { Box, Flex, Tag } from "@chakra-ui/react";

export default function Hashtags({ hashtags, gap = 2, ...rest }) {
  return (
    <Flex flexWrap="wrap" gap={gap}>
      {hashtags.map((t) => (
        <Box key={t}>
          <Tag size="md" {...rest}>
            <Link href={`/t/${t}`}>{t}</Link>
          </Tag>
        </Box>
      ))}
    </Flex>
  );
}
