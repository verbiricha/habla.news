import Link from "next/link";

import { useAtom } from "jotai";
import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import { relaysAtom } from "@habla/state";
import { getMetadata } from "@habla/nip23";
import Markdown from "@habla/markdown/Markdown";
import { useUser } from "@habla/nostr/hooks";
import User from "./User";

export default function UserCard({ pubkey, posts, size = "sm", ...rest }) {
  const [relays] = useAtom(relaysAtom);
  const user = useUser(pubkey);
  return (
    <Card variant="outline" size={size}>
      <CardHeader>
        <User pubkey={pubkey} />
      </CardHeader>
      <CardBody>
        {user?.about && (
          <Text my={4}>
            <Markdown content={user?.about} />
          </Text>
        )}
        <UnorderedList>
          {posts.map((p) => {
            const { title, identifier } = getMetadata(p);
            const naddr = nip19.naddrEncode({
              kind: p.kind,
              pubkey,
              identifier,
              relays,
            });
            return (
              <ListItem key={naddr}>
                <Link href={`/a/${naddr}`}>
                  <Heading fontSize="lg" fontWeight={500}>
                    {title}
                  </Heading>
                </Link>
              </ListItem>
            );
          })}
        </UnorderedList>
      </CardBody>
    </Card>
  );
}
