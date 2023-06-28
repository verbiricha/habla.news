import Link from "next/link";

import { Box, Flex, Tag } from "@chakra-ui/react";

export function Hashtag({ tag }) {
  return (
    <Tag size="sm" fontWeight={300}>
      <Link href={`/t/${tag}`} shallow>
        {tag}
      </Link>
    </Tag>
  );
}

export default function Hashtags({ hashtags, gap = 2, ...rest }) {
  return (
    <Flex flexWrap="wrap" gap={gap} {...rest}>
      {hashtags.map((t) => (
        <Box key={t}>
          <Hashtag tag={t} />
        </Box>
      ))}
    </Flex>
  );
}
