import { useMemo } from "react";
import Link from "next/link";
import { dedupe } from "@habla/util";

import { Box, Flex, Tag } from "@chakra-ui/react";

export function Hashtag({ tag, ...rest }) {
  return (
    <Tag color="chakra-body-text" size="sm" fontWeight={300} {...rest}>
      <Link href={`/t/${tag}`} shallow>
        {tag}
      </Link>
    </Tag>
  );
}

export default function Hashtags({ hashtags, gap = 2, ...rest }) {
  const deduped = useMemo(() => dedupe(hashtags), [hashtags]);
  return (
    <Flex flexWrap="wrap" gap={gap} {...rest}>
      {deduped.map((t, idx) => (
        <Box key={`${t}-${idx}`}>
          <Hashtag tag={t} {...rest} />
        </Box>
      ))}
    </Flex>
  );
}
