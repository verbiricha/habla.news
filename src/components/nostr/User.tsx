import { useRouter } from "next/router";

import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";
import { Flex } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import Avatar from "@habla/components/nostr/Avatar";
import Username from "@habla/components/nostr/Username";

export default function User({ pubkey, size = "sm", ...rest }) {
  const [relays] = useAtom(relaysAtom);
  const router = useRouter();
  return (
    <Flex
      gap="2"
      alignItems="center"
      flexWrap="wrap"
      cursor="pointer"
      wordBreak="break-word"
      onClick={() =>
        router.push(
          `/p/${nip19.nprofileEncode({ pubkey, relays })}`,
          undefined,
          { shallow: true }
        )
      }
      {...rest}
    >
      <Avatar size={size} pubkey={pubkey} />
      <Username pubkey={pubkey} {...rest} />
    </Flex>
  );
}
