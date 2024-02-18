// components/navbar.tsx
import Link from 'next/link';
import React from 'react';
import Image from 'next/image'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react';
import { web3 } from "@alephium/web3";
import { useEffect } from "react";

const Navbar = () => {
  const wallet = useWallet()

  useEffect(() => {
    if (wallet?.nodeProvider !== undefined) {
      web3.setCurrentNodeProvider(wallet.nodeProvider)
    }
  }, [wallet?.nodeProvider])
  
  return (
    <nav className="text-white p-4 bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Image src="/images/ChronoSwapLogo_NoText_NoWhite.png" width={32} height={32} alt="ChronoSwap Logo" quality={100}/>
          <a href="/swap" className="hover:text-gray-300 ">Swap</a>
          <a href="/pools" className="hover:text-gray-300">Pools</a>
        </div>
        <div style={{ position: "absolute", top: "10px", right: "80px" }}>
            <AlephiumConnectButton />
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
