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
      <div className="flex">
        <CustomSidebar />
        <div className="flex flex-col w-full">
          <CustomNavbar />
          <main className="bg-gray-900 min-h-screen flex-grow">{children}</main>
        </div>
      </div>
    </>
  );
}