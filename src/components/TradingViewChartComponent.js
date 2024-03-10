// components/TradingViewChartComponent.js
import React, { useRef, useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
function TradingViewChartComponent() {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (chartContainerRef.current) {
        function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
            var switcherElement = document.createElement('div');
            switcherElement.classList.add('switcher');
        
            var intervalElements = items.map(function(item) {
                var itemEl = document.createElement('button');
                itemEl.innerText = item;
                itemEl.classList.add('switcher-item');
                itemEl.classList.toggle('switcher-active-item', item === activeItem);
                itemEl.addEventListener('click', function() {
                    onItemClicked(item);
                });
                switcherElement.appendChild(itemEl);
                return itemEl;
            });
        
            function onItemClicked(item) {
                if (item === activeItem) {
                    return;
                }
        
                intervalElements.forEach(function(element, index) {
                    element.classList.toggle('switcher-active-item', items[index] === item);
                });
        
                activeItem = item;
        
                activeItemChangedCallback(item);
            }
        
            return switcherElement;
        }
        
        var switcherElement = createSimpleSwitcher(['Dark', 'Light'], 'Dark', syncToTheme);
        
        var chartElement = document.createElement('div');
        
        var chart = createChart(chartElement, {
            width: 600,
            height: 300,
            rightPriceScale: {
                borderVisible: false,
            },
            timeScale: {
                borderVisible: false,
            },
            localization: {
                timeFormatter: businessDayOrTimestamp => {
                    return Date(businessDayOrTimestamp); //or whatever JS formatting you want here
                },
           },
        });
        
        document.body.appendChild(chartElement);
        document.body.appendChild(switcherElement);
        
        var areaSeries = chart.addAreaSeries({
          topColor: 'rgba(33, 150, 243, 0.56)',
          bottomColor: 'rgba(33, 150, 243, 0.04)',
          lineColor: 'rgba(33, 150, 243, 1)',
          lineWidth: 2,
        });
        
        var darkTheme = {
            chart: {
                layout: {
                    background: {
                        type: 'solid',
                        color: '#2B2B43',
                    },
                    lineColor: '#2B2B43',
                    textColor: '#D9D9D9',
                },
                watermark: {
                    color: 'rgba(0, 0, 0, 0)',
                },
                crosshair: {
                    color: '#758696',
                },
                grid: {
                    vertLines: {
                        color: '#2B2B43',
                    },
                    horzLines: {
                        color: '#363C4E',
                    },
                },
            },
            series: {
                    topColor: 'rgba(32, 226, 47, 0.56)',
                    bottomColor: 'rgba(32, 226, 47, 0.04)',
                    lineColor: 'rgba(32, 226, 47, 1)',
            },
        };
        
        const lightTheme = {
            chart: {
                layout: {
                    background: {
                        type: 'solid',
                        color: '#FFFFFF',
                    },
                    lineColor: '#2B2B43',
                    textColor: '#191919',
                },
                watermark: {
                    color: 'rgba(0, 0, 0, 0)',
                },
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        color: '#f0f3fa',
                    },
                },
            },
            series: {
                    topColor: 'rgba(33, 150, 243, 0.56)',
                    bottomColor: 'rgba(33, 150, 243, 0.04)',
                    lineColor: 'rgba(33, 150, 243, 1)',
            },
        };
        
        var themesData = {
            Dark: darkTheme,
            Light: lightTheme,
        };
        
        function syncToTheme(theme) {
            chart.applyOptions(themesData[theme].chart);
            areaSeries.applyOptions(themesData[theme].series);
        }

        const fetchData = async () => {
           
           console.log('here')
             try {
              const response = await fetch('/api/mongoData');
              console.log(response);
              const result = await response.json();


              // Convert the date-time strings to milliseconds since the epoch
  const dataWithMilliseconds = result.map(dataPoint => ({
    time: new Date(dataPoint.time).getTime(),
    value: dataPoint.value,
  }));
              const formattedData = result.map(item => {
                const dateObject = new Date(item.time);
                const formattedDate = dateObject.toISOString().replace(/\.\d{3}Z/, 'Z').replace('Z', '+00:00');

                return {
                    time: Date.parse(formattedDate),
                    value: item.value,
                };
            });
            
            

              console.log(dataWithMilliseconds);
              areaSeries.setData(dataWithMilliseconds);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
         fetchData();
        
      // areaSeries.setData([
         //  { time: Date.parse('2024-03-10T21:04:33+00:00'), value: 35.75 },
         //   { time: Date.parse('2024-03-10T21:04:34+00:00'), value: 38.75 },
        //    { time: Date.parse('2024-03-10T21:04:35+00:00'), value: 35.75 },
       // ]);

        
        syncToTheme('Dark');

      return () => chart.remove();
    }
  }, []);

  return <div ref={chartContainerRef} />;
}

export default TradingViewChartComponent;
