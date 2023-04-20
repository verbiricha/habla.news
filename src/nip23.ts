import { findTag, findTags } from "./tags";

type PostMetadata = {
  title: string;
  identifier: string;
  summary?: string;
  image?: string;
  publishedAt?: number;
  hashtags: string[];
};

export function getMetadata(ev: NDKEvent): PostMetadata {
  const pubAt = findTag(ev, "published_at");
  let publishedAt;
  if (pubAt) {
    try {
      publishedAt = Number(publishedAt) * 1000;
    } catch (error) {}
  }
  return {
    identifier: findTag(ev, "d"),
    title: findTag(ev, "title"),
    summary: findTag(ev, "summary"),
    image: findTag(ev, "image"),
    hashtags: findTags(ev, "t"),
    publishedAt: publishedAt ? publishedAt : ev.created_at,
  };
}
