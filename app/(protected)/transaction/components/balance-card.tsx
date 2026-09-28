"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BalanceSkeleton } from "./balance-skeleton";
import { getBalance } from "../api/get-balance";
import { AppError } from "@/lib/api/app-error";

export function BalanceCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError>();
  const [totalBalance, setTotalBalance] = useState<string>();

  useEffect(() => {
    const abortController = new AbortController();

    async function getTotalBalance() {
      try {
        const result = await getBalance(abortController.signal);

        if (abortController.signal.aborted) return;

        setTotalBalance(result);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        if (error instanceof AppError) {
          setError(error);
          return;
        }

        setError(
          new AppError("Something went wrong.", {
            type: "UNKNOWN_ERROR",
            cause: error,
          }),
        );
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
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
        ) : error ? (
          <Label>ไม่สามารถดึงข้อมูลได้</Label>
        ) : (
          <Label className="text-3xl">{totalBalance}</Label>
        )}
      </CardContent>
    </Card>
  );
}
