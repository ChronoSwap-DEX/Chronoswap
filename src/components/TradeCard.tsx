// components/TradeCard.tsx
import Image from 'next/image'
import React, { useEffect, useState } from 'react';

const TradeCard: React.FC = () => { 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after the component is mounted
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // delay in ms

    return () => clearTimeout(timer);
  }, []);

  // Conditional classes based on visibility
  const visibilityClasses = isVisible ? 'opacity-100' : 'opacity-0';

  return (
    <div className={`relative flex flex-col items-center p-6 rounded-xl transition-opacity duration-1000 ${visibilityClasses} animate-fadeIn`}>
      <div className="flex w-full mb-4 justify-between">
          <a className="sm:text-lg font-medium bg-gray-800 text-gray-200 rounded-xl p-2">Swap</a>
      </div>
      
      <div className="flex flex-col w-full mb-4">

        {/* Input for the ALPH token */}
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">

          <input className="bg-transparent text-2xl font-medium text-white w-full outline-none" placeholder="1.00" disabled />
          <Image src="/images/alephium.png" width={32} height={32} alt="ALPH Logo" quality={100} className="w-6 h-6 mr-2"/>
          <div className="flex items-center gap-1 text-xl">
            ALPH
          </div>

        </div>

        <div className="flex justify-center items-center">
          {/* Swap direction button */}
          <button className="bg-blue-900 rounded-full p-1 m-1 text-white">
            ⇅
          </button>
        </div>

        {/* Input for the CHRON token */}
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
          
          <input className="bg-transparent text-2xl font-medium text-white w-full outline-none" placeholder="10.00" disabled/>
          <Image src="/images/ChronoSwapLogo_NoText_NoWhite.png" width={32} height={32} alt="CHRON Logo" quality={100} className="w-6 h-6 mr-2"/>
          <div className="flex items-center gap-1 text-xl">
          
            CHRON
          </div>
          
        </div>

        <div className="mt-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors">
            <a href="/swap" className="hover:text-gray-300 ">Swap Now!</a>
          </button>
        </div>

      </div>

    </div>
  );
};

export default TradeCard;
