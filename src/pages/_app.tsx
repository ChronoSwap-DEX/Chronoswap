import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { network, networkId } from "@/utils/consts";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { store } from "@/state"
import "../css/CircleLoader.css";
import {NextUIProvider} from "@nextui-org/react";
import { Provider } from "react-redux"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <Provider store={store}>
      <NextUIProvider>
          <AlephiumWalletProvider addressGroup={network.groupIndex} network={networkId}>
            
              <Component {...pageProps} />

        </AlephiumWalletProvider>
      </NextUIProvider>
    </Provider>
  );
}