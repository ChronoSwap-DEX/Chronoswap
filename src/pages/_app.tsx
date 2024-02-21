import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { tokenFaucetConfig } from "@/services/utils";
import { AlephiumWalletProvider } from "@alephium/web3-react"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
      <AlephiumWalletProvider addressGroup={tokenFaucetConfig.groupIndex} network={tokenFaucetConfig.network}>
          <Component {...pageProps} />
      </AlephiumWalletProvider>
  );
}

export default MyApp;
