import React from "react";
import Head from "next/head";

export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>ChronoSwap 🕗</title>
        <meta name="description" content="The DEX, CronoSwap!" />
        <link rel="icon" href="/images/logo_NoText_NoWhite.png" />
      </Head>
      <main className="bg-gray-900 min-h-screen">{children}</main>
    </>
  );
}