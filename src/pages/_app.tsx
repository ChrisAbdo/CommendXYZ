import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import Navbar from "@/components/navbar";

const activeChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThirdwebProvider activeChain={activeChainId}>
        <Navbar />
        <Component {...pageProps} />
      </ThirdwebProvider>
    </>
  );
}
