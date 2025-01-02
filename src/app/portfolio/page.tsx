"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { AppSidebar } from "../components/app-sidebar";
import AppHeader from '../components/AppHeader';
import { SidebarProvider } from "@/components/ui/sidebar";
import styles from './page.module.css';

const PortfolioDashboard = ({ children }: { children: React.ReactNode }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  const handleValueChange = (selectedAlias: string) => {
    const foundPortfolio = portfolios.find(
      (portfolio) => portfolio.alias === selectedAlias
    );
    setSelectedPortfolio(foundPortfolio || null);
  };

  const calculateTotalValue = () => {
    if (!selectedPortfolio) {
      return 0;
    }
    let _sum = selectedPortfolio.availableBalance;
    selectedPortfolio.holdings.map((item) => {
      _sum = _sum + parseFloat(item.investedAmount);
    })
    return _sum;
  }

  const formatNumber = (x: Number) => {
    x = Number(x);
    if (x.valueOf() < 10000) {
      return (Math.round(100*x.valueOf()) / 100).toString();
    }
    const decimals = Math.round((100 * (x.valueOf() - Math.floor(x.valueOf())))) / 10;
    console.log(decimals);
    const reversed = Math.round(x.valueOf()).toString().split('').reverse();
    const groups = [];
    for (let i = 0; i < reversed.length; i += 3) {
      groups.push(reversed.slice(i, i + 3).reverse().join(''));
    }
    return groups.reverse().join(' ').concat(".", decimals != 0 ? decimals.toString() : "00");
  }

  const roundToNDecimals = (x: String) => {
    const y = Number(x);
    return Math.round(y*100)/100;
  }

  interface ApiLatestValueResponseItem {
    adjclose: number;
    close: number;
    high: number;
    low: number;
    open: number;
    timestamp: number;
    volume: number;
  }

  interface ApiLatestValueResponseWrapper {
    data: ApiLatestValueResponseItem[];
  }

  function convertToLatestValue(response: ApiLatestValueResponseWrapper): string {
    return response.data.slice(-1)[0].close.toString();
  }

  interface PortfolioResponseItem {
    alias: string;
    user_id: number;
    account_number: string;
    portfolio_id: number;
    available_balance: string;
    holdings: PortfolioResponseItemHolding[];
  }

  interface PortfolioResponseItemHolding {
    invested_amount: string;
    name: string;
    shares: string;
    ticker: string;
  }

  interface PortfoliosWrapper {
    portfolios: PortfolioResponseItem[]
  }

  function calculateRelativeValueChange(holding: Holding) {
    return Math.round(100*(parseFloat(holding.latestValue) * parseFloat(holding.shares) / parseFloat(holding.investedAmount) - 1) * 100) / 100
  }

  function calculateAbsoluteValueChange(holding: Holding) {
    return Math.round(100*(parseFloat(holding.latestValue) * parseFloat(holding.shares) - parseFloat(holding.investedAmount)))/100
  }

  async function convertToHoldings(response: PortfolioResponseItem): Promise<Holding[]> {
    return Promise.all(
      response.holdings.map(async (item) => {
        const latest = await fetchLatestQuote(item.ticker, item.name);
        return ({
          name: item.name,
          ticker: item.ticker,
          investedAmount: item.invested_amount,
          shares: item.shares,
          latestValue: latest ? latest : "123"
        })
      })
    );
  }

  async function convertToPortfolios(response: PortfoliosWrapper): Promise<Portfolio[]> {
    return Promise.all(
      response.portfolios.map(async (item) => {
        return ({
          alias: item.alias,
          portfolioId: item.portfolio_id,
          userId: item.user_id,
          accountNumber: item.account_number,
          availableBalance: parseFloat(item.available_balance),
          holdings: await convertToHoldings(item)
        })
      }));
  }

  type Portfolio = {
    alias: string;
    portfolioId: number;
    userId: number;
    accountNumber: string;
    availableBalance: number;
    holdings: Holding[];
  };

  type Holding = {
    name: string,
    ticker: string;
    investedAmount: string;
    shares: string;
    latestValue: string;
  };

  async function fetchLatestQuote(ticker: string, name: string) {
    try {
      const response = await fetch('/api/latest_quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker,
        }),
      });
      const data = await response.json();
      const latestValue = convertToLatestValue(data);
      return latestValue;
    } catch (error) {
      console.error("Error during fetching of quotes: ", error);
      return null;
    }
  }

  async function fetchPortfolios() {
    try {
      const response = await fetch('/api/get_portfolios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error("Error during fetching portfolios: ", response.status, response.ok);
      }
      const data = await response.json();
      const fetchedPortfolios = await convertToPortfolios(data);
      setPortfolios(fetchedPortfolios);
      return fetchedPortfolios;
    } catch (error) {
      console.error("Error during fetching portfolios: ", error);
    }
  }

  useEffect(() => {
    fetchPortfolios().then((fetchedPortfolios) => {
      if (fetchedPortfolios && fetchedPortfolios.length > 0 ) {
          setSelectedPortfolio(fetchedPortfolios[0]);
          console.log(portfolios);
      }
    });
  }, []);

  return (
    <div>
      <main className={styles.main}>
        <div className="w-full max-w-6xl mx-auto space-y-8 p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Portfolio Overview</CardTitle>
                <Select value={selectedPortfolio?.alias} onValueChange={handleValueChange}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios?.map((portfolio) => (
                      <SelectItem key={portfolio.alias} value={portfolio.alias}>
                        {portfolio.alias}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Total Value</div>
                  <div className="text-2xl font-bold">{selectedPortfolio ? "$"+formatNumber(calculateTotalValue()) : "$123"}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Available to Trade</div>
                  <div className="text-2xl font-bold">{selectedPortfolio ? "$"+formatNumber(selectedPortfolio.availableBalance) : "$123"}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">Year Development</div>
                  <div className="text-2xl font-bold text-green-600 flex items-center">
                    <TrendingUp className="mr-2" />
                    +24.91%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium text-right">Value Change</th>
                      <th className="px-4 py-3 font-medium text-right">Change %</th>
                      <th className="px-4 py-3 font-medium text-right">Shares</th>
                      <th className="px-4 py-3 font-medium text-right">Share Price</th>
                      <th className="px-4 py-3 font-medium text-right">Current Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedPortfolio?.holdings.map((holding) => (
                      <tr key={holding.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{holding.name}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={calculateAbsoluteValueChange(holding)  >= 0 ? "text-[#0EAC16]" : "text-[#D0184D]"}>
                            {calculateAbsoluteValueChange(holding) >= 0 ? '+' : ''}{calculateAbsoluteValueChange(holding)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={calculateRelativeValueChange(holding) >= 0 ? "text-[#0EAC16]" : "text-[#D0184D]"}>
                            {calculateRelativeValueChange(holding) >= 0 ? '+' : ''}{calculateRelativeValueChange(holding)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {holding.shares}
                        </td>
                        <td className="px-4 py-3 text-right">
                          ${roundToNDecimals(holding.latestValue)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          ${roundToNDecimals(holding.investedAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <AppHeader />
        <div>
          <SidebarProvider>
            <AppSidebar />
            <main>
              {children}
            </main>
          </SidebarProvider>
        </div>

      </main>
    </div>

  );
};

export default PortfolioDashboard;