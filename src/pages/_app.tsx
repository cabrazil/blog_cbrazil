import "@/styles/globals.css";
import "@/styles/article.css";
import "@/styles/home.css";
import "@/styles/admin.css";
import type { AppProps } from "next/app";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import CookieBanner from '@/components/CookieBanner';
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <CookieBanner />
    </UserProvider>
  );
}
