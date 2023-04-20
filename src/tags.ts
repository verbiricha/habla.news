export function findTag(ev: NDKEvent, tag) {
  return ev.tags?.find((t) => t.at(0) === tag)?.at(1);
}

export function findTags(ev: NDKEvent, tag) {
  return ev.tags.filter((t) => t.at(0) === tag).map((t) => t.at(1));
}
