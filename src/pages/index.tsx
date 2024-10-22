// pages/index.tsx
import React from 'react'
import Link from 'next/link'
import IndexLayout from '@/components/indexLayout';
import { buttonVariants } from "@/components/button"

const Home: React.FC = () => {
    
  return (
    <IndexLayout>
      <div className="flex flex-col min-h-screen justify-center items-center text-white">
        
        <section className="flex flex-col items-center justify-center my-10 mx-auto px-4 max-w-6xl text-center">

          <h1 className="text-4xl font-bold tracking-tighter mb-5">
            ChronoSwap, the timeless DEX.
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Enter the cosmos of the Alephium ecosystem to trade over 20 tokens perpetually.
          </p>
          <Link href="/swap" className={buttonVariants({ variant: "outline" })}>
              Enter App
          </Link>

        </section>
        
      </div>
  </IndexLayout>
  );
};

export default Home;