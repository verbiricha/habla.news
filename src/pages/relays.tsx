import { useState, useEffect } from "react";

import Link from "next/link";
import Head from "next/head";
import { useAtom } from "jotai";
import { Flex, Stack, Heading, Text, Spinner } from "@chakra-ui/react";

import { relaysAtom } from "@habla/state";
import { RelayItem } from "@habla/components/Relays";
import Layout from "@habla/layouts/Wide";

export default function Relays() {
  const [relays] = useAtom(relaysAtom);
  return (
    <>
      <Head>
        <title>Relays</title>
      </Head>
      <Layout>
        {relays && (
          <Stack gap={4}>
            {relays.map((url) => (
              <RelayItem key={url} url={url} />
            ))}
          </Stack>
        )}
      </Layout>
    </>
  );
}
