import "@/styles/globals.css";
import "@/styles/article.css";
import "@/styles/home.css";
import "@/styles/admin.css";
import type { AppProps } from "next/app";
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
