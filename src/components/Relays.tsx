import { useState } from "react";
import Link from "next/link";

import {
  Flex,
  Stack,
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";
import { useAtom } from "jotai";

import { relaysAtom } from "@habla/state";
import useRelayMetadata from "@habla/hooks/useRelayMetadata";
import RelaySummary, { Operator, Nips } from "./RelaySummary";
import RelayFavicon from "./RelayFavicon";
import InputCopy from "@habla/components/InputCopy";
import RelayLink from "@habla/components/RelayLink";
import NipLink from "@habla/components/NipLink";

export function RelayItem({ url, ...rest }) {
  const { data, isError } = useRelayMetadata(url);
  return (
    <Stack spacing={4} {...rest}>
      <Flex
        flexDirection={["column", "row"]}
        alignItems={["flex-start", "center"]}
        justifyContent="space-between"
      >
        <RelayLink url={url}>
          <Stack align="center" direction="row">
            <RelayFavicon size="xs" url={url} />
            <Heading fontSize="2xl" sx={{ wordBreak: "break-word" }}>
              {data?.name || url}
            </Heading>
          </Stack>
        </RelayLink>
        {data?.pubkey && <Operator info={data} />}
      </Flex>
      {data?.description && <Text>{data.description}</Text>}
      {data && <Nips info={data} />}
    </Stack>
  );
}

export function RelayCard({ url, ...props }) {
  const { data, isError } = useRelayMetadata(url);
  return (
    <Card variant="outline" {...props}>
      <CardHeader>
        <Stack>
          <RelayLink url={url}>
            <Stack align="center" direction="row">
              <RelayFavicon size="xs" url={url} />
              <Heading fontSize="2xl" sx={{ wordBreak: "break-word" }}>
                {data?.name || url}
              </Heading>
            </Stack>
          </RelayLink>
          {data?.pubkey && <Operator info={data} />}
        </Stack>
      </CardHeader>
      <RelayLink url={url}>
        <CardBody>
          {isError ? (
            <Text color="gray.400">
              Could not fetch <NipLink nip={11} /> metadata
            </Text>
          ) : data ? (
            <>
              <RelaySummary url={url} info={data} />
            </>
          ) : null}
        </CardBody>
      </RelayLink>
    </Card>
  );
}

export default function Relays() {
  const [relays] = useAtom(relaysAtom);
  return (
    <Stack spacing={4}>
      {relays.map((url) => (
        <RelayCard key={url} url={url} />
      ))}
    </Stack>
  );
}
