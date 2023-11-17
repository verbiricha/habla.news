import { useMemo } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAtom } from "jotai";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import { useNdk } from "@habla/nostr/hooks";
import { bookmarkListsAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";

const BookmarkLists = dynamic(
  () => import("@habla/components/nostr/BookmarkLists"),
  {
    ssr: false,
  }
);

export default function BookmarksPage() {
  const ndk = useNdk();
  const [bookmarkLists] = useAtom(bookmarkListsAtom);
  const bookmarks = useMemo(
    () => Object.values(bookmarkLists).map((ev) => new NDKEvent(ndk, ev)),
    [bookmarkLists]
  );
  return (
    <>
      <Head>
        <title>Bookmarks</title>
        <meta name="og:title" content="Habla" />
        <meta name="og:description" content="Speak your mind" />
      </Head>
      <Layout>
        <BookmarkLists bookmarks={bookmarks} />
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
