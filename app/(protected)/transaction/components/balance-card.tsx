"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BalanceSkeleton } from "./balance-skeleton";

type TotalBalanceResponseType = {
  totalBalance: number;
};

export function BalanceCard() {
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    const abortController = new AbortController();

    async function getTotalBalance() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CAPTAIN_API}/api/Transactions/total-balance`,
          {
            credentials: "include",
            signal: abortController.signal,
          },
        );

        const data: TotalBalanceResponseType = await response.json();

        setTotalBalance(data.totalBalance);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setLoading(false);
        console.log(error);
      }
    }

    getTotalBalance();

    return () => {
      abortController.abort();
    };
  }, []);

  const formattedBalance = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalBalance);

  return (
    <Card className="flex flex-col items-center rounded-lg">
      <CardContent className="flex flex-col items-center">
        <CardDescription className="text-base">เงินทั้งหมด</CardDescription>
        {loading ? (
          <BalanceSkeleton />
        ) : (
          <Label className="text-3xl">{formattedBalance}</Label>
        )}
      </CardContent>
    </Card>
  );
}
