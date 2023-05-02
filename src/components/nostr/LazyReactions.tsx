import Reactions from "./Reactions";
import CachedReactions from "./CachedReactions";

export default function LazyReactions({ event, kinds, live }) {
  return live ? (
    <Reactions
      event={event}
      kinds={kinds}
      opts={{ cacheUsage: "PARALLEL", closeOnEose: false }}
    />
  ) : (
    <CachedReactions kinds={kinds} event={event} />
  );
}
