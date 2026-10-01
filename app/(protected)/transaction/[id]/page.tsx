"use client";

import { Card } from "@/components/ui/card";
import { TransactionResponse } from "@/lib/api/generated";
import { use, useEffect, useState } from "react";
import { getTransactionById } from "./api/get-transaction-by-id";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/api/handle-api-error";
import { AppError } from "@/lib/api/app-error";
import { TransactionPageSkeleton } from "./components/transaction-page-skeleton";

export default function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError>();
  const [transaction, setTransaction] = useState<TransactionResponse>();

  useEffect(() => {
    const abortController = new AbortController();
    async function loadTransaction(id: string) {
      setLoading(true);

      try {
        const transaction = await getTransactionById(
          id,
          abortController.signal,
        );

        if (abortController.signal.aborted) return;

        setTransaction(transaction);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        if (error instanceof AppError) {
          return handleApiError(error);
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

    loadTransaction(id);

    return () => {
      abortController.abort();
    };
  }, [id]);

  if (loading) {
    return <TransactionPageSkeleton />;
  }

  if (error || !transaction) {
    return (
      <div className="flex h-svh">
        <Card className="m-4 flex flex-1 items-center justify-center gap-4 p-2 text-base">
          <Label>ดาวน์โหลข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง</Label>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-svh">
      <Card className="m-4 flex w-full flex-col gap-5 overflow-auto p-2">
        <Input
          defaultValue={transaction.title}
          className="rounded-lg text-xl"
        />
        <Input
          defaultValue={transaction.description}
          className="rounded-lg text-base"
        />
        <Input
          defaultValue={transaction.categoryName}
          className="rounded-lg text-base"
        />
        <Input
          defaultValue={transaction.amount}
          className="rounded-lg text-base"
        />
        <Input
          defaultValue={transaction.updatedDate}
          className="rounded-lg text-base"
        />
        <div className="flex w-full justify-evenly gap-4">
          <Button variant="destructive" className="flex-1 rounded-lg">
            ลบ
          </Button>
          <Button className="flex-1 rounded-lg">บันทึก</Button>
        </div>
      </Card>
    </div>
  );
}
