import React from "react";
import Head from "next/head";
import { AiOutlineSwap } from 'react-icons/ai'
import { MdPool, MdWaterDrop, MdWater, MdCandlestickChart, MdLock, MdAddCircle, MdOutlineRemoveCircle } from "react-icons/md";
import { ThemeProvider } from "./themeProvider";
import { Poppins as FontSans } from "next/font/google"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import Link from "next/link";
import { AlephiumConnectButton } from "@alephium/web3-react";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "500"
})

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu} from "@nextui-org/react";
import {ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale} from "@/components/Icons";

export default function MainLayout({ children }: { children: React.ReactNode }) {

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30}/>,
    activity: <Activity className="text-secondary" fill="currentColor" size={30} />,
    flash: <Flash className="text-primary" fill="currentColor" size={30}/>,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30}/>,
  };

  return (
    <>
    
      <Head>
        <title>ChronoSwap</title>
        <meta name="description" content="The DEX, CronoSwap!" />
        <link rel="icon" href="/images/logo_NoText_NoWhite.png" />
      </Head>
        
        <div className="flex-1">
        <ThemeProvider  attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className={cn("min-h-screen font-sans antialiased", fontSans.variable)}>
          
          <Navbar>

            <NavbarBrand>
              <Image src="/images/ChronoSwapLogo_NoText_NoWhite.png" width={50} height={50} className="m-3" quality={100} alt="ChronoSwapLogo.png" />
              <div className="text-2xl font-bold p-4">ChronoSwap</div>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">

              <NavbarItem>
                <Link color="foreground" href="/swap" className="flex items-center text-lg ">
                  Swap
                </Link>
              </NavbarItem>

              <Dropdown>
                <NavbarItem>
                  <DropdownTrigger>
                    <Button
                      disableRipple
                      className="p-0 bg-transparent data-[hover=true]:bg-transparent flex items-center text-lg"
                      endContent={icons.chevron}
                      radius="sm"
                      variant="light">
                      Liquidity
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label="ACME features"
                  className="w-[340px]"
                  itemClasses={{
                    base: "gap-4",
                  }}
                >
                  <DropdownItem
                    key="AddLiquidity"
                    description="ACME scales apps to meet user demand, automagically, based on load."
                    startContent={icons.scale} href="/addLiquidity" as={Link}>
                      Add Liquidity
                  </DropdownItem>

                  <DropdownItem
                    key="usage_metrics"
                    description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                    startContent={icons.activity}
                  >
                    Usage Metrics
                  </DropdownItem>

                  <DropdownItem
                    key="production_ready"
                    description="ACME runs on ACME, join us and others serving requests at web scale."
                    startContent={icons.flash}
                  >
                    Production Ready
                  </DropdownItem>

                  <DropdownItem
                    key="99_uptime"
                    description="Applications stay on the grid with high availability and high uptime guarantees."
                    startContent={icons.server}
                  >
                    +99% Uptime
                  </DropdownItem>

                  <DropdownItem
                    key="supreme_support"
                    description="Overcome any challenge with a supporting team ready to respond."
                    startContent={icons.user}
                  >
                    +Supreme Support
                  </DropdownItem>

                </DropdownMenu>
              </Dropdown>

            </NavbarContent>

            <NavbarContent justify="end">

              <AlephiumConnectButton/>

            </NavbarContent>

          </Navbar>

            {children}

          </main>
        </ThemeProvider>
        </div>
    </>
  );
}