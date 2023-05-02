import { Box } from "@chakra-ui/react";
import { useInView } from "react-intersection-observer";

import Reactions from "./Reactions";
import CachedReactions from "./CachedReactions";

export default function LazyReactions(props) {
  const { ref, inView } = useInView({
    threshold: 1,
  });
  return (
    <Box ref={ref}>
      {inView ? (
        <Reactions
          {...props}
          opts={{ cacheUsage: "PARALLEL", closeOnEose: false }}
        />
      ) : (
        <CachedReactions {...props} />
      )}
    </Box>
  );
}
