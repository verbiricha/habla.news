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
      publishedAt = Number(pubAt);
    } catch (error) {}
  }
  const metadata = {
    identifier: findTag(ev, "d"),
    hashtags: findTags(ev, "t"),
    publishedAt: publishedAt ? publishedAt : ev.created_at * 1000,
  };
  const title = findTag(ev, "title") || findTag(ev, "subject");
  if (title) {
    metadata.title = title;
  }
  const image = findTag(ev, "image");
  if (image) {
    metadata.image = image;
  }
  const summary = findTag(ev, "summary");
  if (summary) {
    metadata.summary = summary;
  }
  return metadata;
}
