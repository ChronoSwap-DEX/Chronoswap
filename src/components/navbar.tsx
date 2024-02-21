// components/navbar.tsx
import Link from 'next/link';
import React, { ReactNode } from 'react';
import Image from 'next/image'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react';
import { web3 } from "@alephium/web3";
import { useEffect } from "react";
import { Navbar, Sidebar } from 'flowbite-react';

export const CustomNavbar: React.FC = () => {
  const wallet = useWallet()

  useEffect(() => {
    if (wallet?.nodeProvider !== undefined) {
      web3.setCurrentNodeProvider(wallet.nodeProvider)
    }
  }, [wallet?.nodeProvider])
  
  return (

    <Navbar fluid={true} rounded={false} className="text-white p-4 bg-gray-900">

      <Navbar.Brand>
        <Image src="/images/ChronoSwapLogo_NoText_NoWhite.png" width={32} height={20} alt="ChronoSwap Logo" quality={100}/>
        <span className="self-center whitespace-nowrap text-xl font-semibold p-2">
          CronoSwap
        </span>
      </Navbar.Brand>
    </Navbar>
  );
};

export const CustomSidebar: React.FC = () => {
  return (
    <Sidebar className="text-white g-[#0a0a23]">
      {/* Navigation Links */}
      <Link href="/swap" legacyBehavior>
        <a className="flex items-center px-12 py-2 hover:bg-blue-700 transition-colors">
          {/* Replace with your actual SVG icon */}
          <svg className="h-6 w-6 mr-2" /* SVG Path here */ />
          Swap
        </a>
      </Link>
      {/* Repeat for other links */}
    </Sidebar>
  );
};
