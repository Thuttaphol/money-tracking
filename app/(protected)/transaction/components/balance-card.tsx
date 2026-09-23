"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type TotalBalanceResponseType = {
  totalBalance: number;
};

export function BalanceCard() {
  const [loading, setLoading] = useState(true);
  const [balanceResponse, setBalanceResponse] =
    useState<TotalBalanceResponseType | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function getTotalBalance() {
      try {
        const response = await fetch(
          "http://localhost:5194/api/Transactions/total-balance",
          {
            credentials: "include",
            signal: abortController.signal,
          },
        );

        const data: TotalBalanceResponseType = await response.json();

        setBalanceResponse(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.log(error);
      } finally {
        setLoading(false);
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
  }).format(balanceResponse?.totalBalance ?? 0);

  return (
    <Card className="flex flex-col items-center rounded-lg">
      <CardContent className="flex flex-col items-center">
        <CardDescription className="text-base">เงินทั้งหมด</CardDescription>
        <Label className="text-3xl">{formattedBalance}</Label>
      </CardContent>
    </Card>
  );
}
