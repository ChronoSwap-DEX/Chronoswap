// components/TradingViewChart.js
import dynamic from 'next/dynamic';
import React, { useRef, useEffect } from 'react';

const FlowByteChart = dynamic(
  () => import('../components/flowbyteChartComponent'),
  { ssr: false }
);

export default FlowByteChart;