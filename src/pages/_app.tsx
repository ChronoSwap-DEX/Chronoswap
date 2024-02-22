import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { network, networkId } from "@/utils/consts";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import "../css/CircleLoader.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
      <AlephiumWalletProvider addressGroup={network.groupIndex} network={networkId}>
          <Component {...pageProps} />
      </AlephiumWalletProvider>
  );
}

export default MyApp;
