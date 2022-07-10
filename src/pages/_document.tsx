import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="da">
        <Head>
          <meta charSet="utf-8" />

          <link rel="shortcut icon" sizes="any" href="/favicon.ico?v=1.1" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=1.1" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png?v=1.1"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png?v=1.1"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png?v=1.1"
          />
          <link rel="manifest" href="/site.webmanifest?v=1.1" />
          <link
            rel="mask-icon"
            href="/safari-pinned-tab.svg?v=1.1"
            color="#18181b"
          />
          <meta name="apple-mobile-web-app-title" content="Analyticz.io" />
          <meta name="application-name" content="Analyticz.io" />
          <meta name="msapplication-TileColor" content="#18181b" />
          <meta name="theme-color" content="#18181b" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
