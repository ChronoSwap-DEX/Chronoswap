// pages/index.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import IndexLayout from '@/components/indexLayout';

const Home: React.FC = () => {
  // You would fetch real data here, using the alephium libs
  
  const stats = [
    { label: 'CHRON PRICE', value: '$0.26' },
    { label: 'TOTAL LIQUIDITY', value: '$16.09M' },
    { label: 'TOTAL VOLUME', value: '$5.89M' },
    { label: 'TOTAL PAIRS', value: '29' }
  ];

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
          <Link href="/swap" className='w-full max-w-xs bg-gradient-to-tr from-blue-950 to-indigo-800 hover:bg-blue-700 text-center font-bold py-3 rounded-xl'>
              Enter App
          </Link>

        </section>
        
      </div>
  </IndexLayout>
  );
};

export default Home;