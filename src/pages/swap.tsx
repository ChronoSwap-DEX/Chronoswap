// pages/swap.tsx
import React from 'react';
import { useState } from 'react';

export default function Swap() {
  // Example tokens, you'd fetch these from your backend or a smart contract
  const [tokenA, setTokenA] = useState('ETH');
  const [tokenB, setTokenB] = useState('ALPH');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Swap Tokens</h1>
      <div className="mt-4">
        {/* Token selection and trade execution form */}
        <p>Form to select tokens and execute trades will go here.</p>
      </div>
    </div>
  );
}
