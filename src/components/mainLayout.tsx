import React from "react";
import Head from "next/head";
import { CustomNavbar } from "@/components/navbar";
import { ThemeProvider } from "./themeProvider";
import { Poppins as FontSans } from "next/font/google"
import Image from 'next/image'
import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "500"
})


export default function MainLayout({ children }: { children: React.ReactNode }) {
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
          <CustomNavbar/>
            {children}
          </main>
        </ThemeProvider>
        </div>
    </>
  );
}