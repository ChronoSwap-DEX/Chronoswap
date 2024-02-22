import React from "react";
import Head from "next/head";
import { CustomNavbar, CustomSidebar } from "@/components/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>ChronoSwap</title>
        <meta name="description" content="The DEX, CronoSwap!" />
        <link rel="icon" href="/images/logo_NoText_NoWhite.png" />
      </Head>

      <CustomNavbar />

      <div className="flex">
        <CustomSidebar />
        <div className="flex-1">
          <main className="bg-gray-900 min-h-screen flex-grow p-8">{children}</main>
        </div>
      </div>
    </>
  );
}