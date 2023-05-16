import { Flex, Stack, Text, Button } from "@chakra-ui/react";

import SectionHeading from "@habla/components/SectionHeading";
import User from "@habla/components/nostr/User";
import Address from "@habla/components/nostr/feed/Address";
import FollowButton from "@habla/components/nostr/FollowButton";

function Featured({ naddr, kind, pubkey, identifier }) {
  return (
    <Address
      fontSize="2xl"
      naddr={naddr}
      kind={kind}
      pubkey={pubkey}
      identifier={identifier}
      excludeReactions
    />
  );
}

function Faq() {
  return (
    <Featured
      naddr={
        "naddr1qqxnzd3cxserxdpsxverzwp4qywhwumn8ghj7atwd9mx2unnv5hxummnw3exjcmg9ekxzmny9uqsuamnwvaz7tmwdaejumr0dshszymhwden5te0danxvcmgv95kutnsw43z7qg3waehxw309ahx7um5wgh8w6twv5hszxthwden5te0dehhxarj94mk7unvvshxsvm69e48qtcpremhxue69uhkummnw3ez6ur4vgh8wetvd3hhyer9wghxuet59uq32amnwvaz7tmjv4kxz7fwv3sk6atn9e5k7tcpramhxue69uhkummnw3ez6un9d3shjtnwda4k7arpwfhjucm0d5hsz9mhwden5te0wfjkccte9ec82mntdp6kytndv5hszxnhwden5te0wfjkccte9ehx7um5wf5kx6pwd3skuep0qyt8wumn8ghj7mn0wd68ytndd9kx7afwd3hkctcpr9mhxue69uhhyetvv9ujuumwdae8gtnnda3kjctv9uq3kamnwvaz7tmjv4kxz7fwdehhxarjvaexzurg9ehx2ap0qyd8wumn8ghj7ctyw4k8gt338pcxcatn9eek7cmfv9kz7qgcwaehxw309anxjmr5v4ezumn0wd68ytnhd9hx2tczypl4c26wfzswnlk2vwjxky7dhqjgnaqzqwvdvz3qwz5k3j4grrt46qcyqqq823c75plyn"
      }
      kind={30023}
      pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d"
      identifier="1684234032185"
    />
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
  "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d",
  "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93",
  "5df413d4c5e5035ff508fd99b38b21ea9a0ac0b9ecc34f3312aba9aa2add4f5b",
];

export function FeaturedAuthors() {
  return (
    <>
      <SectionHeading>Popular authors</SectionHeading>
      <Stack gap={2}>
        {featuredAuthors.map((pubkey) => {
          return (
            <Flex alignItems="center" justifyContent="space-between">
              <User pubkey={pubkey} />
              <FollowButton pubkey={pubkey} />
            </Flex>
          );
        })}
      </Stack>
    </>
  );
}

export default function FeaturedArticles() {
  return (
    <>
      <SectionHeading>Popular</SectionHeading>
      <Stack spacing={4}>
        <WelcomeToNostr />
        <Faq />
        <PurpleText />
      </Stack>
    </>
  );
}
