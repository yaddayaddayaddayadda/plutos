"use client";

import { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import  AppHeader from '../components/AppHeader';
import { Stock, columns, convertToStocks } from "./columns"
import { DataTable } from "./data-table"
import styles from './page.module.css';


export default function StocksPage({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);

  async function fetchStocks(exchange: string = 'popular') {
    try {
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "category": exchange }),
      });
        if (!response.ok) {
             const errorData = await response.json();
             console.error("Error during sign in: ", errorData);
            return;
        }
       const data = await response.json();
       setStocks(convertToStocks(data));
    } catch (error) {
         console.error("Error during conversion: ", error);
    }
    }
   useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <>
        <div className="w-full">
        <AppHeader />
        </div>
        <SidebarProvider>
        <AppSidebar />
        <main className={styles.main}>
          {children}
          <div className="container mx-auto py-10 my-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4 mt-6 text-center">List of stocks</h1>
          <h2 className="text-1xl sm:text-1xl md:text-1xl font-bold text-gray-900 tracking-tight leading-tight mb-4 mt-6 text-center">View our exclusive offering of stocks from all the major exchanges.</h2>
          <p className="text-sm font-normal text-gray-900 tracking-tight leading-tight mb-4 mt-1 max-w-xl mx-auto text-center">Discover thousands of stocks from all over the world and find your hidden gems. To learn more about a stock, simply click on the name and discover all the information you need.</p>
        <DataTable columns={columns} data={stocks} fetchStocks={fetchStocks}/>
        </div>
        </main>
      </SidebarProvider>
        </>
      )
}