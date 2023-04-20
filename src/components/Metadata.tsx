import Head from "next/head";

export interface MetadataProps {
  title: string;
  description?: string;
  image?: string;
}

export default function Metadata({ metadata }) {
  return (
    <Head>
      <title>{metadata.title}</title>

      <meta name="og:title" content={metadata.title} />
      <meta name="og:description" content={metadata.description} />
      {metadata.image && <meta name="og:image" content={metadata.image} />}

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      {metadata.image && <meta name="twitter:image" content={metadata.image} />}
    </Head>
  );
}
