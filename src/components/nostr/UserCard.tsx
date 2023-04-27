import { useAtom } from "jotai";
import { Flex, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import Markdown from "@habla/markdown/Markdown";
import { relaysAtom } from "@habla/state";
import User from "./User";
import { shortenString } from "@habla/format";
import { useUser } from "@habla/nostr/hooks";

export default function UserCard({ pubkey, size = "sm", children, ...rest }) {
  const user = useUser(pubkey);
  return (
    <Card variant="outline">
      <CardHeader>
        <Flex>
          <User pubkey={pubkey} />
        </Flex>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
