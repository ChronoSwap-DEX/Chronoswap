// pages/index.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TradeCard from "@/components/TradeCard"; // Component for the trading interface
import StatisticCard from "@/components/StatisticCard"; // Component for the individual statistics

const Home: React.FC = () => {
  // You would fetch real data here, possibly using `getStaticProps` or an API call
  const stats = [
    { label: 'CHRON PRICE', value: '$0.26' },
    { label: 'TOTAL LIQUIDITY', value: '$16.09M' },
    { label: 'TOTAL VOLUME', value: '$5.89M' },
    { label: 'TOTAL PAIRS', value: '29' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <section className="flex flex-col-reverse lg:grid lg:grid-cols-[auto_400px] gap-[100px] items-center justify-between my-10 mx-auto px-4 max-w-5xl">
        <div className="flex flex-col">
          <h1 className="md:text-4xl font-bold tracking-tighter lg:leading-[1.1] mb-4">
            ChronoSwap the timeless DEX. 
            <span className="text-blue-500"> Whenever.</span>
          </h1>
          <p className="sm:text-xl text-gray-400">
            Unlock the world of cryptocurrency trading. Experience the freedom to trade over 20 tokens instantly on the Alephium blockchain, no registration needed.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <TradeCard />
        </div>
      </section>

      <section className="flex flex-wrap justify-around items-center my-10">
        {stats.map((stat, idx) => (
          <StatisticCard key={idx} label={stat.label} value={stat.value} />
        ))}
      </section>
  </div>
  );
};

export default Home;