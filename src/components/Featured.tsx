import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { Flex, Stack, Text, Button } from "@chakra-ui/react";

import SectionHeading from "@habla/components/SectionHeading";
import User from "@habla/components/nostr/User";
import ArticleTitle from "@habla/components/nostr/ArticleTitle";

const FollowButton = dynamic(
  () => import("@habla/components/nostr/FollowButton"),
  { ssr: false }
);

function Featured({ naddr, kind, pubkey, identifier }) {
  return (
    <Stack>
      <ArticleTitle
        naddr={naddr}
        kind={kind}
        pubkey={pubkey}
        identifier={identifier}
      />
      <User size="xs" pubkey={pubkey} showNostrAddress={true} />
    </Stack>
  );
}

function WelcomeToNostr() {
  return (
    <Featured
      naddr={
        "naddr1qqxnzd3cxy6rjv3hx5cnyde5qy88wumn8ghj7mn0wvhxcmmv9uq3uamnwvaz7tmwdaehgu3dwp6kytnhv4kxcmmjv3jhytnwv46z7qg3waehxw309ahx7um5wgh8w6twv5hszymhwden5te0danxvcmgv95kutnsw43z7qglwaehxw309ahx7um5wgkhyetvv9ujumn0ddhhgctjduhxxmmd9upzql6u9d8y3g8flm9x8frtz0xmsfyf7spq8xxkpgs8p2tge25p346aqvzqqqr4gukz494x"
      }
      kind={30023}
      pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d"
      identifier="1681492751274"
    />
  );
}

function HablaFeatures() {
  return (
    <Featured
      naddr={
        "naddr1qq8xsctzd3sj6en9v9682un9wvq32amnwvaz7tmjv4kxz7fwv3sk6atn9e5k7tcpr4mhxue69uhh2mnfwejhyum99ehx7um5wf5kx6pwd3skuep0qyghwumn8ghj7mn0wd68ytnhd9hx2tcpramhxue69uhkummnw3ez6un9d3shjtnwda4k7arpwfhjucm0d5hszxthwden5te0dehhxarj94mk7unvvshxsvm69e48qtcpr9mhxue69uhhyetvv9ujuumwdae8gtnnda3kjctv9uq35amnwvaz7tmjv4kxz7fwdehhxarjd93kstnvv9hxgtcpzamhxue69uhhyetvv9ujumn0wd68ytnzv9hxgtcppemhxue69uhkummn9ekx7mp0qgs87hptfey2p607ef36g6cnekuzfz05qgpe34s2ypc2j6x24qvdwhgrqsqqqa28q0jrdf"
      }
      kind={30023}
      pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d"
      identifier="habla-features"
    />
  );
}

function NativeInternetProtocolForSocialMedia() {
  return (
    <Featured
      naddr={
        "naddr1qqxnzd3cxyerxd3h8qerwwfcqgsgydql3q4ka27d9wnlrmus4tvkrnc8ftc4h8h5fgyln54gl0a7dgsrqsqqqa28qy28wumn8ghj7un9d3shjtnyv9kh2uewd9hszrthwden5te0dehhxtnvdakqvtl0f3"
      }
      kind={30023}
      pubkey="82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2"
      identifier="1681236782798"
    />
  );
}

function NostrTree() {
  return (
    <Featured
      naddr="naddr1qqyrzv3kvvukzvpjqgstnem9g6aqv3tw6vqaneftcj06frns56lj9q470gdww228vysz8hqrqsqqqa28qy2hwumn8ghj7un9d3shjtnyv9kh2uewd9hj7qgawaehxw309a6ku6tkv4e8xefwdehhxarjd93kstnvv9hxgtcpz9mhxue69uhkummnw3ezuamfdejj7qglwaehxw309ahx7um5wgkhyetvv9ujumn0ddhhgctjduhxxmmd9uq3jamnwvaz7tmwdaehgu3dwahhymry9e5rx73wdfcz7qgewaehxw309aex2mrp0yh8xmn0wf6zuum0vd5kzmp0qyd8wumn8ghj7un9d3shjtnwdaehgunfvd5zumrpdejz7qghwaehxw309aex2mrp0yhxummnw3ezucnpdejz7qgwwaehxw309ahx7uewd3hkctc2ke2j0"
      kind={30023}
      pubkey="b9e76546ba06456ed301d9e52bc49fa48e70a6bf2282be7a1ae72947612023dc"
      identifier="126c9a02"
    />
  );
}

function PurpleText() {
  return (
    <Featured
      naddr={
        "naddr1qqxnzd3cxqmrzv3exgmr2wfeqgsxu35yyt0mwjjh8pcz4zprhxegz69t4wr9t74vk6zne58wzh0waycrqsqqqa28pjfdhz"
      }
      kind={30023}
      pubkey="6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93"
      identifier="1680612926599"
    />
  );
}

const featuredAuthors = [
  "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93",
  "b9e76546ba06456ed301d9e52bc49fa48e70a6bf2282be7a1ae72947612023dc",
  "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d",
];

export function FeaturedAuthors() {
  const { t } = useTranslation("common");
  return (
    <>
      <SectionHeading>{t("popular-authors")}</SectionHeading>
      <Stack gap={2}>
        {featuredAuthors.map((pubkey) => {
          return (
            <Flex
              key={pubkey}
              alignItems="center"
              justifyContent="space-between"
            >
              <User pubkey={pubkey} showNostrAddress={true} />
              <FollowButton pubkey={pubkey} />
            </Flex>
          );
        })}
      </Stack>
    </>
  );
}

export default function FeaturedArticles() {
  const { t } = useTranslation("common");
  return (
    <>
      <SectionHeading>{t("popular-posts")}</SectionHeading>
      <Stack spacing={4}>
        <PurpleText />
        <NostrTree />
        <NativeInternetProtocolForSocialMedia />
      </Stack>
    </>
  );
}
