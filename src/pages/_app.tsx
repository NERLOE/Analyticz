// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import AnalyticzProvider from "@providers/AnalyticzProvider";

/* 
  Font Awesome Initialization
*/
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Analyticz.io</title>
        <link rel="canonical" href={process.env.SITE_URL + router.pathname} />
        <meta name="title" content="Analyticz.io" />
        <meta name="twitter:title" content="Analyticz.io" />
        <meta
          name="description"
          content="Analyticz.io is an open source analytics website, for monitoring and analyzing traffic on your website."
        />
        <meta
          name="twitter:description"
          content="Analyticz.io is an open source analytics website, for monitoring and analyzing traffic on your website."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@analyticzio" />
        <meta name="og:site-name" content="Analyticz" />
      </Head>

      <AnalyticzProvider domain="analyticz.marcusnerloe.dk">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </AnalyticzProvider>
    </>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.NODE_ENV === "production" && process.env.SITE_URL) {
    return `${process.env.SITE_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
        };
      },
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
