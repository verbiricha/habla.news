import { Stack, Heading } from "@chakra-ui/react";

import Hashtags from "@habla/components/Hashtags";
import useTopTags from "@habla/hooks/useTopTags";

export default function HotTopics() {
  const tags = useTopTags(7);
  return tags.length > 0 ? (
    <Stack>
      <Heading fontSize="4xl" fontWeight={500}>
        🔥 topics
      </Heading>
      <Hashtags hashtags={tags} />
    </Stack>
  ) : null;
}
