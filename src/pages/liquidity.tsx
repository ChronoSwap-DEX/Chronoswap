// pages/liquidity.tsx
import MainLayout from '@/components/mainLayout';
import React from 'react';

export default function Liquidity() {
    return (
      <MainLayout>
        <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-950 to-indigo-800 rounded-2xl text-white border-solid border-indigo-600 border-y border-x">
          <h1 className="text-3xl font-bold text-center">Provide Liquidity</h1>
          <div className="mt-4 text-center">
            <p>UI for adding liquidity to pools will go here.</p>
          </div>
        </div>
      </MainLayout>
      
    );
  }
  