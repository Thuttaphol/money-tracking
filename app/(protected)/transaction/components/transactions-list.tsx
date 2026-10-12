"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { TransactionsListSkeleton } from "./transactions-list-skeleton";
import { getTransactions } from "../api/get-transactions";
import { AppError } from "@/lib/api/app-error";
import { TransactionResponse } from "@/lib/api/generated";

export function TransactionList() {
  const [error, setError] = useState<AppError>();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

  const [reference, setReference] = useState<number>();
  const [hasMore, setHasMore] = useState(true);

  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  const loadTransactions = useCallback(
    async (signal: AbortSignal) => {
      if (loading || !hasMore) {
        return;
      }

      if (signal.aborted) {
        return;
      }

      try {
        setLoading(true);
        const transactions = await getTransactions(reference, 20, signal);

        setTransactions((current) => [...current, ...transactions.data]);
        setReference(transactions.reference);
        setHasMore(transactions.hasMore);
      } catch (error) {
        if (signal.aborted) {
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
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [loading, reference, hasMore],
  );

  useEffect(() => {
    const target = observerTargetRef.current;
    const abortController = new AbortController();

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !loading && hasMore) {
          loadTransactions(abortController.signal);
        }
      },
      {
        scrollMargin: "0px 0px 500px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [loadTransactions]);

  function handleTryLoadTransaction() {
    const abortController = new AbortController();
    loadTransactions(abortController.signal);
  }

  if (error) {
    return (
      <Card className="flex flex-1 flex-col items-center justify-center gap-4 overflow-auto p-2 text-base">
        <Label>ดาวน์โหลข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง</Label>
        <Button onClick={handleTryLoadTransaction}>ลองอีกครั้ง</Button>
      </Card>
    );
  }

  function formattedAmount(amount: number) {
    return Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function formattedDate(date: string) {
    return Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Bangkok",
    }).format(new Date(date));
  }

  return (
    <Card className="flex flex-1 flex-col gap-2 p-2">
      {transactions.map((transaction) => {
        return (
          <Link href={`/transaction/${transaction.id}`} key={transaction.id}>
            <div
              key={transaction.id}
              className="bg-sidebar-border hover:bg-sidebar-border/80 flex h-fit items-center justify-between rounded-lg hover:cursor-default"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex">
                  <CardHeader className="flex-2 py-2 pl-4 text-base">
                    {transaction.title}
                  </CardHeader>
                  {transaction.transactionType === "Income" ? (
                    <CardHeader className="flex-2 py-2 pr-0 text-right text-base text-green-700">
                      +{formattedAmount(transaction.amount)}
                    </CardHeader>
                  ) : (
                    <CardHeader className="flex-2 py-2 pr-0 text-right text-base text-red-700">
                      -{formattedAmount(transaction.amount)}
                    </CardHeader>
                  )}
                </div>
                <div className="flex flex-1">
                  <div className="px-5 pb-2">
                    {transaction.description === null ||
                    transaction.description === undefined ||
                    transaction.description === "" ? (
                      <div className="h-full">{"\u00A0"}</div>
                    ) : (
                      <div className="text-gray-400">
                        {transaction.description}
                      </div>
                    )}
                  </div>
                  <div className="mr-0 flex-2 text-right text-gray-400">
                    {formattedDate(transaction.transactionDate)}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-secondary-foreground mr-3" />
            </div>
          </Link>
        );
      })}
      {loading && (
        <div className="flex flex-col">
          <TransactionsListSkeleton />
          <TransactionsListSkeleton />
          <TransactionsListSkeleton />
        </div>
      )}
      <div ref={observerTargetRef} />
    </Card>
  );
}
