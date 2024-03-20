import React, { useRef, useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';

function FlowbyteChartComponent() {
    const chartContainerRef = useRef(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/mongoData');
                const result = await response.json();
                // Assuming your API response is an array of objects with 'time' and 'value' properties
                setData(result.map(({ _id, time, value }) => ({ time, value })));

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(data);
        if (chartContainerRef.current && data.length > 0) {
            const options = {
                chart: {
                    // Your chart options
                    type: 'area',
                    height: '100%',
                    maxWidth: '100%',
                    fontFamily: 'Inter, sans-serif',
                    dropShadow: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                tooltip: {
                    enabled: false,
                    x: {
                        show: false,
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.55,
                        opacityTo: 0,
                        shade: '#1C64F2',
                        gradientToColors: ['#1C64F2'],
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    width: 6,
                },
                grid: {
                    show: false,
                    strokeDashArray: 4,
                    padding: {
                        left: 2,
                        right: 2,
                        top: 0,
                    },
                },
                series: [
                    {
                        name: 'Token',
                        data: data.map(item => ({
                            x: new Date(item.time),
                            y: item.value,
                        })),
                        color: '#1A56DB',
                    },
                ],
                xaxis: {
                    categories: data.map(item => new Date(item.time).toISOString().slice(0, 10)),
                    labels: {
                        show: false,
                    },
                    
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
               /* yaxis: {
                    
                    show: false,
                },
            };*/

            //Another option for the y axis.
                yaxis: {
        // Set up y-axis configuration to map to the 'value'
       show: false,
    },
};

            const chart = new ApexCharts(chartContainerRef.current, options);
            chart.render();

            // Clean up function to destroy the chart when component unmounts
            return () => {
                chart.destroy();
            };
        }
    }, [data]);

    return <div ref={chartContainerRef} />;
}

export default FlowbyteChartComponent;
