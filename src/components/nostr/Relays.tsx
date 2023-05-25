import { useAtom } from "jotai";

import { Stack } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { RelayItem } from "@habla/components/Relays";

export default function Relays() {
  const [relays] = useAtom(relaysAtom);
  return (
    <Stack gap={8}>
      {relays.map((url) => (
        <RelayItem key={url} url={url} />
      ))}
    </Stack>
  );
}
