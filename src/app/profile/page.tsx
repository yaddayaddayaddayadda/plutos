"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import AppHeader from '../components/AppHeader';
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";

export default function ProfilePage({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [alias, setAlias] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function createPortfolio() {
    try {
      const response = await fetch('/api/create_portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "account_number": accountNumber,
          "available_balance": parseFloat(deposit),
          "alias": alias
        }),
      });
      if (!response.ok) {
        console.error("Error during deposit");
        setToastMessage("Failed to create portfolio. Please try again.");
        setToastVisible(true);
        return;
      }
      setToastMessage("Portfolio created successfully!");
      setToastVisible(true);
      setAccountNumber("");
      setDeposit("");
    } catch (error) {
      console.error("Error during deposit: ", error);
      setToastMessage("An unexpected error occurred.");
      setToastVisible(true);
    }
  }

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Not logged in: ${errorData.message}`);
        return;
      }
      const data = await response.json();
      console.log(data);
      if (data.user_id) {
        setMessage(`Welcome back to Plutos, ${data.user_id}`);
      }
      else {
        setMessage("Not Logged in");
      }
    } catch (error) {
      console.error("Error during sign in: ", error);
      setMessage("An unexpected error occurred");
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
        return;
      }
    } catch (error) {
      console.error("Error during fetching portfolios: ", error);
    }
  }
  useEffect(() => {
    fetchPortfolios();
    fetchProfile();
  }, []);


  return (
    <main className={styles.main}>
      <ToastProvider>
        {toastVisible && (
          <Toast onOpenChange={() => setToastVisible(false)}>
            <div className="flex">
              <span>{toastMessage}</span>
            </div>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
      <div className="w-full">
        <AppHeader />
      </div>
      <p>{message}</p>
      <div className = "mt-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create a portfolio</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new portfolio</DialogTitle>
            <DialogDescription>
              Enter a seven digit account number and an initial balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alias" className="text-right" >
                Name of portfolio
              </Label>
              <Input id="alias" className="col-span-3" onChange={(e) => setAlias(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right" >
                Account number
              </Label>
              <Input id="account" className="col-span-3" onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Initial balance
              </Label>
              <Input id="balance" className="col-span-3" onChange={(e) => setDeposit(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createPortfolio} type="submit">Create Portfolio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      <div className="flex-1 w-full">
        <SidebarProvider>
          <AppSidebar />
          <main>
            {children}
          </main>
        </SidebarProvider>
      </div>
    </main>
  );
}