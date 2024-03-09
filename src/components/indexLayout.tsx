import React from "react";
import Head from "next/head";
import { ThemeProvider } from "./themeProvider";
import { Poppins as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "500"
})

export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>ChronoSwap 🕗</title>
        <meta name="description" content="The DEX, CronoSwap!" />
        <link rel="icon" href="/images/logo_NoText_NoWhite.png" />
      </Head>
      <ThemeProvider  attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <main className={cn("bg-background font-sans antialiased", fontSans.variable)}>{children}</main>
      </ThemeProvider>
      
    </>
  );
}


