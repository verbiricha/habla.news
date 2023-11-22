import type { Tags } from "@habla/types";

export function findTag(ev: NDKEvent, tag: string) {
  return ev.tags?.find((t) => t.at(0) === tag)?.at(1);
}

export function findTags(ev: NDKEvent, tag: string) {
  return filterTags(ev, tag).map((t) => t.at(1));
}

export function filterTags(ev: NDKEvent, tag: string) {
  return ev.tags.filter((t) => t.at(0) === tag);
}

export function findFullTag(ev: NDKEvent, tag: string) {
  return ev.tags?.find((t) => t.at(0) === tag);
}

export function filterTagList(tags: Tags, tag: string) {
  return tags.filter((t) => t.at(0) === tag).map((t) => t.at(1));
}

export function pickTopNHashtags(hashtags, n) {
  const frequency = {};
  hashtags.forEach((tag) => {
    frequency[tag] = frequency[tag] || 0;
    frequency[tag]++;
  });

  const frequencyArray = Object.keys(frequency).map((tag) => {
    return { tag: tag, count: frequency[tag] };
  });

  frequencyArray.sort((a, b) => b.count - a.count);

  const topN = frequencyArray.slice(0, n).map((obj) => obj.tag);

  return topN;
}
