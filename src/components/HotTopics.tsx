import { useTranslation } from "next-i18next";
import { Stack } from "@chakra-ui/react";

import Hashtags from "@habla/components/Hashtags";
import SectionHeading from "@habla/components/SectionHeading";
import useTopTags from "@habla/hooks/useTopTags";

export default function HotTopics() {
  const { t } = useTranslation("common");
  const tags = useTopTags(21);
  return tags.length > 0 ? (
    <>
      <SectionHeading>{t("topics")}</SectionHeading>
      <Stack spacing={4}>
        <Hashtags hashtags={tags} variant="solid" />
      </Stack>
    </>
  ) : null;
}
