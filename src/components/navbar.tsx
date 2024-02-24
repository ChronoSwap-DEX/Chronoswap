// components/navbar.tsx
import Link from 'next/link';
import React, { ReactNode } from 'react';
import Image from 'next/image'
import { AlephiumConnectButton, useWallet } from '@alephium/web3-react';
import { web3 } from "@alephium/web3";
import { useEffect } from "react";
import { CustomFlowbiteTheme, Navbar, Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import { AiOutlineSwap } from 'react-icons/ai'
import { MdPool, MdWaterDrop, MdWater, MdCandlestickChart, MdLock, MdAddCircle, MdOutlineRemoveCircle } from "react-icons/md";


export const CustomNavbar: React.FC = () => {
  const wallet = useWallet()

  useEffect(() => {
    if (wallet?.nodeProvider !== undefined) {
      web3.setCurrentNodeProvider(wallet.nodeProvider)
    }
  }, [wallet?.nodeProvider])
  
  return (

    <Navbar fluid={true} rounded={false} className="text-white p-4 bg-gradient-to-tr from-blue-950 to-indigo-950">

      <Navbar.Brand>
        <Image src="/images/ChronoSwapLogo_NoText_NoWhite.png" width={40} height={40} alt="ChronoSwap Logo" quality={100}/>
        <span className="self-center whitespace-nowrap text-xl font-medium tracking-wider p-2">
          ChronoSwap
        </span>
      </Navbar.Brand>
      <div style={{ position: "absolute", top: "10px", right: "80px" }}>
        <AlephiumConnectButton/>
      </div>
    </Navbar>
  );
};

const customTheme: CustomFlowbiteTheme['sidebar'] = {
  "root": {
    "base": "bg-blue-950",
    "inner": "h-full overflow-y-auto overflow-x-hidden rounded py-4 px-3"
  },
  "collapse": {
    "button": "group flex w-full items-center rounded-lg p-2 text-base font-normal transition duration-75 hover:bg-indigo-900 text-white",
    "icon": {
      "base": "h-6 w-6",
      "open": {
        "off": "text-white",
        "on": "text-gray-300"
      }
    },
    "label": {
      "base": "ml-3 flex-1 whitespace-nowrap text-left",
      "icon": {
        "base": "h-6 w-6 transition ease-in-out delay-0",
        "open": {
          "on": "rotate-180",
          "off": ""
        }
      }
    },
    "list": "space-y-2 py-2"
  },
  "item": {
    "base": "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-indigo-900 text-white ",
    "active": "bg-gray-100 dark:bg-gray-700",
    "collapsed": {
      "insideCollapse": "group w-full pl-8 transition duration-75",
      "noIcon": "font-bold"
    },
    "content": {
      "base": "px-3 flex-1 whitespace-nowrap"
    },
    "icon": {
      "base": "h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-gray-900",
      "active": "text-gray-700 dark:text-gray-100"
    },
    "label": "",
    "listItem": ""
  },
  "items": {
    "base": ""
  },
  "itemGroup": {
    "base": "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 "
  },
  "logo": {
    "base": "mb-5 flex items-center pl-2.5",
    "collapsed": {
      "on": "hidden",
      "off": "self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    },
    "img": "mr-3 h-6 sm:h-7"
  }
} 

export const CustomSidebar: React.FC = () => {
  return (

    <Sidebar theme={customTheme}>
      <Sidebar.Items>
        <Sidebar.ItemGroup >
          <Sidebar.Item as={Link} href="/swap" icon={AiOutlineSwap} >
            Swap
          </Sidebar.Item>

          <Sidebar.Collapse icon={MdWaterDrop} label="Liquidity">
            <Sidebar.Item as={Link} icon={MdAddCircle} href="/addLiquidity">Add Liquidity</Sidebar.Item>
            <Sidebar.Item as={Link} icon={MdOutlineRemoveCircle} href="/removeLiquidity">Remove Liquidity</Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Collapse icon={MdWater} label="Pools">
            <Sidebar.Item as={Link} icon={MdPool} href="/pools">Pools</Sidebar.Item>
            <Sidebar.Item as={Link} icon={MdAddCircle} href="/addPool">Add Pool</Sidebar.Item>
          </Sidebar.Collapse>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

  );
};
