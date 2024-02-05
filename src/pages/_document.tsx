import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

export default class Document extends NextDocument {
  render() {
    return (
      <Html dir="auto">
        <Head>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <meta name="apple-mobile-web-app-status-bar" content="#151220" />
          <meta name="theme-color" content="#151220" />
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
