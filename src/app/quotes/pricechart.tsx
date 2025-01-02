"use client";

import { useEffect, useRef, useState } from 'react';
import { init, dispose } from 'klinecharts';

interface KlineData {
    close: number;
    high: number;
    low: number;
    open: number;
    timestamp: number;
    volume: number;
}

interface ApiResponseItem {
  adjclose: number;
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
  volume: number;
}

interface KlineChartProps {
  ticker: string;
  startDate: Date;
  endDate: Date;
  frequency: string;
}

const initialData: KlineData[] = [
    { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
    { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
    { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
    { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
    { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
    { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
    { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
    { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
    { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
    { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
];

  const handleSubmit = async ({ ticker, startDate, endDate, frequency } : KlineChartProps) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ticker,
          start_date: startDate.toISOString().replace("Z", "+00:00"),
          end_date: endDate.toISOString().replace("Z", "+00:00"),
          frequency
        }),
      });
      const data = await response.json();

      return data.data
    } catch (error) {
      console.error("Error during fetching of quotes: ", error);
      return null;
    }
  }

export default function KlineChart({ ticker, startDate, endDate, frequency } : KlineChartProps) {
    const chartRef = useRef<any>(null);
    const [data, setData] = useState<KlineData[] >(initialData);

    useEffect(() => {
      const chart = init('chart');
      chartRef.current = chart;

    async function fetchData() {
          const json: ApiResponseItem[] = await handleSubmit({ ticker, startDate, endDate, frequency } );
          const transformedData: KlineData[] = json.map((item) => ({
              close: item.close,
              open: item.open,
              high: item.high,
              low: item.low,
              timestamp: item.timestamp*1000,
              volume: item.volume
          }));
          setData(transformedData);
          if(chart) {
              chart.applyNewData(transformedData)
          }

      }
      (async () => {
        await fetchData();
      })();
        return () => {
            if (chartRef.current) {
               dispose('chart')
               chartRef.current = null;
            }
        };
    }, [ticker, startDate, endDate, frequency]);


    return (
      <div className="chart" id="chart" style={{ width: 1200, height: 800 }} />
    );
}