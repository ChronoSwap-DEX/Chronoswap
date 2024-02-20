import React from "react";
import Head from "next/head";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>ChronoSwap 🕗</title>
        <meta name="description" content="The DEX, CronoSwap!" />
        <link rel="icon" href="/images/logo_NoText_NoWhite.png" />
      </Head>
      <Navbar />
      <main className="bg-gray-900 min-h-screen">{children}</main>
    </>
  );
}