"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useState } from "react";

export type Stock = {
    buyButton: string,
    ticker: string
    latestValue: number
    marketCap: number
    changeOneDay: number
    changeOneYear: number
    currency: string,
    shortName: string
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

export const columns: ColumnDef<Stock>[] = [
    {
        accessorKey: "buyButton",
        header: "",
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState(false);
            const [shares, setShares] = useState<number | undefined>();
            const [selectedPortfolio, setSelectedPortfolio] = useState<number | undefined>();

            const handlePurchase = async () => {
                if (!shares) {
                    alert("Please enter a valid number of shares.");
                    return;
                }
                const body = {
                    name: row.original.shortName,
                    ticker: row.original.ticker,
                    shares: shares,
                    portfolio_id: selectedPortfolio,
                    amount: row.original.latestValue * shares
                }
                try {
                    const response = await fetch("/api/purchase_stock", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    });

                    if (response.ok) {
                        setIsOpen(false);
                        setShares(undefined);
                        alert("Purchase successful");
                    } else {
                        const errorData = await response.json();
                        console.error("Error purchasing stock:", errorData);
                        alert(`Error purchasing stock: ${JSON.stringify(errorData)}`);
                    }
                } catch (error) {
                    console.error("Error purchasing stock:", error);
                    alert("Error purchasing stock: ${e}");
                }
            };
            return (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="link"
                            size="sm"
                            className="text-[#0474CA] font-bold"
                        >
                            Buy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Buy {row.original.ticker}</DialogTitle>
                            <DialogDescription>
                                Enter the number of shares you want to buy.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="shares" className="text-right" >
                                    Number of shares
                                </Label>
                                <Input id="shares" className="col-span-3" onChange={(e) => setShares(parseInt(e.target.value))} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="Portfolio id" className="text-right" >
                                    Portfolio id
                                </Label>
                                <Input id="portfolioid" className="col-span-3" onChange={(e) => setSelectedPortfolio(parseInt(e.target.value))} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handlePurchase}>
                                Buy
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            )
        }
    },
    {
        accessorKey: "shortName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "ticker",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Ticker
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "latestValue",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Latest Value
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return Math.round(row.original.latestValue * 100) / 100;
        }
    },
    {
        accessorKey: "marketCap",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Market Cap (Per Million Units)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const marketCap = Math.round(row.original.marketCap);
            if (marketCap < 10000) {
                return marketCap.toString();
            }
            const reversed = marketCap.toString().split('').reverse();
            const groups = [];
            for (let i = 0; i < reversed.length; i += 3) {
                groups.push(reversed.slice(i, i + 3).reverse().join(''));
            }
            return groups.reverse().join(' ');
        }
    },
    {
        accessorKey: "changeOneDay",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    +/-%
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const change1D = Math.round(row.original.changeOneDay * 100) / 100;
            if (change1D < 0) {
                return (
                    <span className="text-[#D0184D]"> {change1D} </span>
                )
            } else {
                return (
                    <span className="text-[#0EAC16]"> +{change1D} </span>
                )
            }
        }
    },
    {
        accessorKey: "changeOneYear",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    1 Year %
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const change1Y = Math.round(row.original.changeOneYear * 100) / 100;
            if (change1Y < 0) {
                return (
                    <span className="text-[#D0184D]"> {change1Y} </span>
                )
            } else {
                return (
                    <span className="text-[#0EAC16]"> +{change1Y} </span>
                )
            }
        }
    },
    {
        accessorKey: "currency",
        header: "Currency",
    }
]

interface BasicInfoResponseItem {
    short_name: string;
    ticker: string;
    latest_value: number;
    market_cap: number;
    change_1d: number;
    change_1y: number;
    currency: string
}

interface BasicInfoWrapper {
    data: {
        tickers_info: BasicInfoResponseItem[]
    }
}
export function convertToStocks(response: BasicInfoWrapper): Stock[] {
    return response.data.tickers_info.map(item => ({
        buyButton: "dummy",
        shortName: item.short_name,
        ticker: item.ticker,
        latestValue: item.latest_value,
        marketCap: item.market_cap,
        changeOneDay: item.change_1d,
        changeOneYear: item.change_1y,
        currency: item.currency
    }));
}