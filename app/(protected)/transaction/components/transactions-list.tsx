"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TransactionsListSkeleton } from "./transactions-list-skeleton";
import { getTransactions } from "../api/get-transactions";
import { AppError } from "@/lib/api/app-error";
import { TransactionResponse } from "@/lib/api/generated";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function TransactionList() {
  const [error, setError] = useState<AppError>();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState(0);
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
        const result = await getTransactions(reference, 20, signal);

        setTransactions((current) => [...current, ...result.data]);
        setReference(result.reference);
        setHasMore(result.hasMore);
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
    [hasMore, loading, reference],
  );

  useEffect(() => {
    const target = observerTargetRef.current;

    if (!target) {
      return;
    }

    const abortController = new AbortController();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !loading && hasMore) {
          loadTransactions(abortController.signal);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [loading, hasMore, loadTransactions]);

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

  return (
    <Card className="flex flex-1 flex-col gap-2 overflow-auto p-2">
      {transactions.map((transaction) => {
        return (
          <div
            key={transaction.id}
            className="bg-sidebar-border hover:bg-sidebar-border/80 flex h-fit items-center justify-between rounded-lg"
          >
            <div className="flex flex-1 flex-col">
              <CardHeader className="text-sidebar-primary px-4 py-2 text-lg">
                {transaction.title}
              </CardHeader>
              <CardContent className="px-5 pb-2">
                {transaction.description === null ||
                transaction.description === undefined ||
                transaction.description === "" ? (
                  <div className="h-full text-base">{"\u00A0"}</div>
                ) : (
                  <div className="text-secondary-foreground text-base">
                    {transaction.description}
                  </div>
                )}
              </CardContent>
            </div>
            <ChevronRight className="text-secondary-foreground mr-3" />
          </div>
        );
      })}
      {loading && <TransactionsListSkeleton />}
      <div ref={observerTargetRef} />
    </Card>
  );
}
