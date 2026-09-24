"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BalanceSkeleton } from "./balance-skeleton";
import { getBalance } from "../api/get-balance";

export function BalanceCard() {
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState<string | undefined>("");

  useEffect(() => {
    const abortController = new AbortController();

    async function getTotalBalance() {
      try {
        const totalBalance = await getBalance(abortController.signal);
        if (abortController.signal.aborted) return;

        setTotalBalance(totalBalance);
        setLoading(false);
      } catch (error) {
        if (abortController.signal.aborted) return;

        console.log(error);
        setLoading(false);
      }
    }

    getTotalBalance();

    return () => abortController.abort();
  }, []);

  return (
    <Card className="flex flex-col items-center rounded-lg">
      <CardContent className="flex flex-col items-center">
        <CardDescription className="text-base">เงินทั้งหมด</CardDescription>
        {loading ? (
          <BalanceSkeleton />
        ) : (
          <Label className="text-3xl">{totalBalance}</Label>
        )}
      </CardContent>
    </Card>
  );
}
