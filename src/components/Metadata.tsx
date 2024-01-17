import Head from "next/head";

interface PageMetadata {
  title: string;
  summary?: string;
  image?: string;
}

interface MetadataProps {
  url?: string;
  type?: string;
  metadata: PageMetadata;
}

export default function Metadata({
  url,
  type = "website",
  metadata,
}: MetadataProps) {
  return (
    <Head>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.summary} />

      {url && <meta name="og:url" content={url} />}
      <meta name="og:title" content={metadata.title} />
      <meta property="og:type" content={type} />
      {metadata.summary && (
        <meta name="og:description" content={metadata.summary} />
      )}
      {metadata.image ? (
        <meta name="og:image" content={metadata.image} />
      ) : (
        <meta name="og:image" content="https://habla.news/family.png" />
      )}

      {url && <meta name="twitter:url" content={url} />}
      <meta property="twitter:domain" content="habla.news" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      {metadata.summary && (
        <meta name="twitter:description" content={metadata.summary} />
      )}
      {metadata.image ? (
        <meta name="twitter:image" content={metadata.image} />
      ) : (
        <meta name="twitter:image" content="https://habla.news/family.png" />
      )}
    </Head>
  );
}
