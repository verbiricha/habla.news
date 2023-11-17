import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css"
          />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <meta name="apple-mobile-web-app-status-bar" content="#151220" />
          <meta name="theme-color" content="#151220" />
        </Head>
        <body>
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
