import { useState } from "react";

export default function usePublishEvent() {
  const [relaySelection, setRelaySelection] = useState(relays);
  const [zapSplits, setZapSplits] = useState(initialZapSplits);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const [publishedOn, setPublishedOn] = useState([]);
}
