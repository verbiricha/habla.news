import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Layout from "@habla/layouts/Wide";

const Address = dynamic(() => import("@habla/components/nostr/Address"), {
  ssr: false,
});

export default function FAQ() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions</title>
        <meta name="og:title" content="Habla FAQ" />
      </Head>
      <Layout>
        <Address
          naddr={
            "naddr1qqxnzd3cxserxdpsxverzwp4qywhwumn8ghj7atwd9mx2unnv5hxummnw3exjcmg9ekxzmny9uqsuamnwvaz7tmwdaejumr0dshszymhwden5te0danxvcmgv95kutnsw43z7qg3waehxw309ahx7um5wgh8w6twv5hszxthwden5te0dehhxarj94mk7unvvshxsvm69e48qtcpremhxue69uhkummnw3ez6ur4vgh8wetvd3hhyer9wghxuet59uq32amnwvaz7tmjv4kxz7fwv3sk6atn9e5k7tcpramhxue69uhkummnw3ez6un9d3shjtnwda4k7arpwfhjucm0d5hsz9mhwden5te0wfjkccte9ec82mntdp6kytndv5hszxnhwden5te0wfjkccte9ehx7um5wf5kx6pwd3skuep0qyt8wumn8ghj7mn0wd68ytndd9kx7afwd3hkctcpr9mhxue69uhhyetvv9ujuumwdae8gtnnda3kjctv9uq3kamnwvaz7tmjv4kxz7fwdehhxarjvaexzurg9ehx2ap0qyd8wumn8ghj7ctyw4k8gt338pcxcatn9eek7cmfv9kz7qgcwaehxw309anxjmr5v4ezumn0wd68ytnhd9hx2tczypl4c26wfzswnlk2vwjxky7dhqjgnaqzqwvdvz3qwz5k3j4grrt46qcyqqq823c75plyn"
          }
          kind={30023}
          pubkey="7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d"
          identifier="1684234032185"
        />
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
