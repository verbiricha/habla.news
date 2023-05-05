import { Stack } from "@chakra-ui/react";

import Hashtags from "@habla/components/Hashtags";
import SectionHeading from "@habla/components/SectionHeading";
import useTopTags from "@habla/hooks/useTopTags";

export default function HotTopics() {
  const tags = useTopTags(21);
  return tags.length > 0 ? (
    <>
      <SectionHeading>Topics</SectionHeading>
      <Stack spacing={4}>
        <Hashtags hashtags={tags} colorScheme="orange" variant="solid" />
      </Stack>
    </>
  ) : null;
}
