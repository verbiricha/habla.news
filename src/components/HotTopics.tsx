import { Stack, Heading } from "@chakra-ui/react";

import Hashtags from "@habla/components/Hashtags";
import useTopTags from "@habla/hooks/useTopTags";

export default function HotTopics() {
  const tags = useTopTags(12);
  return tags.length > 0 ? (
    <>
      <Heading fontSize="3xl" fontWeight={500}>
        🔥 topics
      </Heading>
      <Stack spacing={4}>
        <Hashtags hashtags={tags} colorScheme="orange" variant="solid" />
      </Stack>
    </>
  ) : null;
}
