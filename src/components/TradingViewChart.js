// components/TradingViewChart.js
import dynamic from 'next/dynamic';
import React, { useRef, useEffect } from 'react';

const TradingViewChart = dynamic(
  () => import('../components/TradingViewChartComponent'),
  { ssr: false }
);

export default TradingViewChart;