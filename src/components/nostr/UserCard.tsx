import { Flex, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import Markdown from "@habla/markdown/Markdown";
import { useUser } from "@habla/nostr/hooks";
import User from "./User";
import FollowButton from "@habla/components/nostr/FollowButton";

function Bio({ profile }) {
  return profile?.about ? (
    <Prose>
      <Markdown content={profile?.about} />
    </Prose>
  ) : null;
}

export default function UserCard({ pubkey, size = "sm", ...rest }) {
  const user = useUser(pubkey);
  return (
    <Card variant="user" size={size}>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <User size="md" pubkey={pubkey} />
          <FollowButton pubkey={pubkey} />
        </Flex>
      </CardHeader>
      <CardBody>{user?.about && <Bio profile={user} />}</CardBody>
    </Card>
  );
}
