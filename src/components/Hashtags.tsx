import Link from "next/link";

import { Box, Flex, Tag } from "@chakra-ui/react";

export default function Hashtags({ hashtags }) {
  return (
    <Flex flexWrap="wrap">
      {hashtags.map((t) => (
        <Box key={t} m={2} ml={0}>
          <Tag size="md">
            <Link href={`/t/${t}`} shallow={true}>
              {t}
            </Link>
          </Tag>
        </Box>
      ))}
    </Flex>
  );
}
