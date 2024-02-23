// pages/swap.tsx
import React from 'react';
import { useState } from 'react';
import Image from 'next/image'
import MainLayout from '@/components/mainLayout';

// Assuming you have a list of tokens and a function to get exchange rates
const tokens = ['ALPH', 'CHRON', 'OtherTokens...']; // Populate with actual tokens

export default function Swap() {
    const [fromToken, setFromToken] = useState(tokens[0]);
    const [toToken, setToToken] = useState(tokens[1]);
    const [amount, setAmount] = useState('');
    const [calculatedAmount, setCalculatedAmount] = useState('');
  
    // Define the missing variables with placeholder values. grab them from blcokchain..
    const [exchangeRate, setExchangeRate] = useState('10'); // Placeholder value
    const [priceImpact, setPriceImpact] = useState('2.42'); // Placeholder value
    const [minReceived, setMinReceived] = useState('9.2'); // Placeholder value
  
    // Function to handle changes to the amount input
    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
      //calculateExchange(event.target.value)
      // Optionally, calculate exchange rate or other values here
    };
  
    // Placeholder function to calculate exchange rate
    const calculateExchange = (amount: number) => {
      // Implement calculation logic
      setCalculatedAmount('10');
      // Set placeholders for the example, in a real app you would calculate these
      setExchangeRate('1'); // Example static value
      setPriceImpact('0.5'); // Example static value
      setMinReceived('Calculated Min Received'); // Example calculated value
    };
  
    const handleSwap = async () => {
      if (!amount || Number(amount) <= 0) {
        alert('Please enter a valid amount to swap.');
        return;
      }
  
      console.log(`Swapping ${amount} ${fromToken} to ${toToken}...`);
  
      setTimeout(() => {
        alert(`Successfully swapped ${amount} ${fromToken} for ${calculatedAmount} ${toToken}.`);
        setAmount('');
        setCalculatedAmount('10');
      }, 1000);
    };

  return (
    <MainLayout>
      <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-950 to-indigo-800 rounded-2xl text-white border-solid border-indigo-600 border-y border-x">

      {/* Token Selection and Amount Input */}
      <div className="space-y-4">
          <label className="block text-lg">Swap</label>

          <div className="relative">
              <label className="block text-sm font-medium">From</label>
              <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
                  
                  <input type="number" value={amount} onChange={handleChangeAmount} className="flex-grow p-3 bg-transparent focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white" placeholder='0.0'  />
                      
                      {/* CHANGE TO CALL POPUP TOKEN SELECTOR! */}
                      <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} className="relative m-3 bg-transparent appearance-none focus:ring-2 focus:ring-blue-950 cursor-pointer">
                          {tokens.map((token) => (
                              <option key={token} value={token} className="bg-transparent" >
                              {token}
                              </option>
                          ))}
                      </select>

              </div>
          </div>

          <div className="relative">
              <label className="block text-sm font-medium">From</label>
              <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
                  
                  <input type="text" value={calculatedAmount} onChange={handleChangeAmount} className="flex-grow p-3 bg-transparent focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white" placeholder='0.0'  />
                      
                      {/* CHANGE TO CALL POPUP TOKEN SELECTOR! */}
                      <select value={toToken} onChange={(e) => setToToken(e.target.value)} className="relative m-3 bg-transparent appearance-none focus:ring-2 focus:ring-blue-950 cursor-pointer">
                          {tokens.map((token) => (
                              <option key={token} value={token} className="text-black">
                                  {token}
                              </option>
                          ))}
                      </select>

              </div>
          </div>
      </div>

      {/* Transaction Details */}
      <div className="my-4 p-4 bg-gradient-to-tl from-blue-950 to-purple-indigo  rounded-2xl rounded">
              <div className="flex justify-between">
                  <span>Price:</span>
                  <span>1 {fromToken} = {exchangeRate} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Expected Output:</span>
                      <span>{calculatedAmount} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Price Impact:</span>
                      <span>{priceImpact} %</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Minium recieved:</span>
                      <span>{minReceived} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                      <span>Fee:</span>
                      <span>0.25%</span>
                  </div>
      </div>

      {/* Swap Button */}
      <button onClick={handleSwap} className="w-full py-3 bg-blue-900 hover:bg-blue-950 rounded-lg shadow text-lg font-bold mt-4">
        Swap
      </button>

      </div>
    </MainLayout>
    );
}