import { Text } from "@chakra-ui/react";
import { findTag } from "@habla/tags";

export default function UnknownKind({ event }) {
  // NIP-31
  const alt = findTag(event, "alt");
  return alt ? (
    <Text>{alt}</Text>
  ) : (
    <Text>Unknown event kind: {event.kind}</Text>
  );
  // NIP-89
  return;
}
