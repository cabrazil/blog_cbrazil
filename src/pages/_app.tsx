import "@/styles/globals.css";
import "@/styles/article.css";
import "@/styles/home.css";
import "@/styles/admin.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
