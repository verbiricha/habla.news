import { useState, useEffect } from "react";

import { getRelayMetadata } from "@habla/nip11";

export default function useRelayMetadata(url) {
  const [data, setData] = useState();
  const [isError, setIsError] = useState();

  useEffect(() => {
    getRelayMetadata(url)
      .then(setData)
      .catch(() => setIsError(true));
  }, [url]);

  return { data, isError };
}
