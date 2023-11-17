import { findTag, findTags } from "@habla/tags";
import { COMMUNITY } from "@habla/const";

type PostMetadata = {
  title: string;
  identifier: string;
  summary?: string;
  image?: string;
  publishedAt?: number;
  hashtags: string[];
  community?: string;
};

export function getMetadata(ev: NDKEvent): PostMetadata {
  const pubAt = findTag(ev, "published_at");
  let publishedAt;
  if (pubAt) {
    try {
      publishedAt = Number(pubAt);
    } catch (error) {
      console.error(error);
    }
  }
  const metadata = {
    title: findTag(ev, "title") || findTag(ev, "subject") || "",
    identifier: findTag(ev, "d"),
    hashtags: findTags(ev, "t"),
    publishedAt,
  };
  const image = findTag(ev, "image");
  if (image) {
    metadata.image = image;
  }
  const summary = findTag(ev, "summary");
  if (summary) {
    metadata.summary = summary;
  }
  const community = ev.tags.find(
    (t) => t.at(0) === "a" && t.at(1).startsWith(`${COMMUNITY}:`)
  );
  if (community) {
    metadata.community = community.at(1);
  }
  return metadata;
}
