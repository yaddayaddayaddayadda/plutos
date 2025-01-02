"use client";

import KlineChart from "./pricechart";
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { AppSidebar } from "../components/app-sidebar";
import AppHeader from '../components/AppHeader';
import { SidebarProvider } from "@/components/ui/sidebar";
import styles from './page.module.css';

const QuotesDashboard = ({ children }: { children: React.ReactNode }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [ticker, setTicker] = useState<string | undefined>(undefined);
  const [frequency, setFrequency] = useState<string>("DAILY");
  const [chartData, setChartData] = useState<{
    ticker?: string;
    startDate?: Date;
    endDate?: Date;
    frequency?: string;
  }>({});

  const handleValueChange = (selectedFrequency: string) => {
    setFrequency(selectedFrequency);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setChartData({
      ticker: ticker,
      startDate: startDate,
      endDate: endDate,
      frequency: frequency,
    })
  };

  return (
    <div>
      <main className={styles.main}>
        <div className="w-full max-w-6xl mx-auto space-y-8 p-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Quotes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm items-center">
                <div className="flex gap-4 w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-4 w-full">
                  <Input
                    className="w-[280px]"
                    type="search"
                    placeholder="MSFT"
                    value={ticker || ""}
                    onChange={(event) => setTicker(event.target.value)}
                  />
                  <Select value={frequency} onValueChange={handleValueChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit">Submit</Button>
              </form>
              {chartData.ticker &&
                chartData.startDate &&
                chartData.endDate &&
                chartData.frequency && (
                  <div className="mt-8">
                    <KlineChart
                      ticker={chartData.ticker}
                      startDate={chartData.startDate}
                      endDate={chartData.endDate}
                      frequency={chartData.frequency}
                    />
                  </div>
                )}
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

export default QuotesDashboard;