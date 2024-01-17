import { useMemo } from "react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { NDKEvent } from "@nostr-dev-kit/ndk";

import { useNdk } from "@habla/nostr/hooks";
import { bookmarkListsAtom } from "@habla/state";
import Layout from "@habla/layouts/Wide";
import Metadata from "@habla/components/Metadata";
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
  const { t } = useTranslation("common");
  const url = "https://habla.news/bookmarks";
  const metadata = {
    title: t("bookmarks"),
  };
  return (
    <>
      <Metadata url={url} metadata={metadata} />
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
