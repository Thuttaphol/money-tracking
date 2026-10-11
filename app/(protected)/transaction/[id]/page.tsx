"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { UpdateTransactionRequest } from "@/lib/api/generated";
import { ChangeEvent, use, useEffect, useState } from "react";
import { getTransactionById } from "./api/get-transaction-by-id";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/api/handle-api-error";
import { AppError } from "@/lib/api/app-error";
import { TransactionPageSkeleton } from "./components/transaction-page-skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { getCategories } from "../add/api/get-categories";
import { updateTransaction } from "./api/update-transaction";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "./api/delete-transaction";

export default function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryItems, setCategoryItems] =
    useState<{ label: string; value: number }[]>();
  const [error, setError] = useState<AppError>();
  const [transaction, setTransaction] = useState({
    id: 0,
    title: "",
    description: "",
    amount: "",
    categoryId: 1,
    transactionDate: new Date(),
  });

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

        setTransaction({
          id: transaction.id,
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount.toString(),
          categoryId: transaction.categoryId,
          transactionDate: new Date(transaction.transactionDate),
        });
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

  useEffect(() => {
    const abortController = new AbortController();

    async function loadCategories() {
      try {
        if (abortController.signal.aborted) {
          return;
        }

        const categories = await getCategories(abortController.signal);

        const categoryItems =
          categories?.map((category) => ({
            label: category.name,
            value: category.id,
          })) ?? [];

        setCategoryItems(categoryItems);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        if (error instanceof AppError) {
          throw handleApiError(error);
        }

        setError(
          new AppError("Something went wrong.", {
            type: "UNKNOWN_ERROR",
            cause: error,
          }),
        );
      } finally {
        if (!abortController.signal.aborted) {
          setCategoryLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      abortController.abort();
    };
  }, []);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "title") {
      if (value.startsWith(" ") || value.includes("  ")) {
        return;
      }

      setTransaction((prev) => ({ ...prev, title: value.trimEnd() }));
    }

    if (name === "amount") {
      if (/^\d*(\.\d{0,2})?$/.test(value)) {
        setTransaction((prev) => ({ ...prev, amount: value }));
      }
    }
  }

  function handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;

    if (name === "description") {
      if (value.startsWith(" ") || value.includes("  ")) {
        return;
      }

      setTransaction((prev) => ({ ...prev, description: value.trimEnd() }));
    }
  }

  function handleCategoryChange(value: number | null) {
    if (!value) {
      return;
    }

    setTransaction((prev) => ({ ...prev, categoryId: value }));
  }

  function handleTransactionDateChange(date: Date | undefined) {
    if (!date) {
      return;
    }

    setTransaction((prev) => ({ ...prev, transactionDate: date }));
  }

  async function handleEditSubmit() {
    const abortController = new AbortController();

    const transactionRequest: UpdateTransactionRequest = {
      id: transaction.id,
      title: transaction.title,
      description: transaction.description,
      amount: Number(transaction.amount),
      categoryId: transaction.categoryId,
      transactionDate: transaction.transactionDate.toISOString(),
    };
    try {
      const response = await updateTransaction(
        transactionRequest,
        abortController.signal,
      );

      if (!response) {
        setError(
          new AppError("Something went wrong.", {
            type: "UNKNOWN_ERROR",
            cause: error,
          }),
        );
      }

      router.push("/transaction");
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async function handleDeleteClick() {
    const abortController = new AbortController();

    try {
      const response = await deleteTransaction(
        transaction.id,
        abortController.signal,
      );

      if (!response) {
        setError(
          new AppError("Something went wrong.", {
            type: "UNKNOWN_ERROR",
            cause: error,
          }),
        );
      }

      router.replace("/transaction");
    } catch (error) {
      throw handleApiError(error);
    }
  }

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
      <Card className="m-4 flex w-full flex-col p-2">
        <CardHeader className="flex w-full justify-center text-lg">
          รายละเอียด
        </CardHeader>
        <div className="flex flex-1 flex-col gap-5 px-2">
          <div>
            <Label className="mb-1">ชื่อรายการ</Label>
            <Input
              name="title"
              placeholder="ชื่อรายการ"
              value={transaction.title}
              onChange={handleInputChange}
              className="rounded-lg text-base"
            />
          </div>
          <div>
            <Label className="mb-1">รายละเอียด</Label>
            <Textarea
              name="description"
              placeholder="รายละเอียด"
              value={transaction.description}
              onChange={handleDescriptionChange}
              className="rounded-lg text-base"
            />
          </div>
          <div>
            <Label className="mb-1">จำนวนเงิน</Label>
            <Input
              name="amount"
              placeholder="จำนวนเงิน"
              type="text"
              inputMode="decimal"
              value={transaction.amount}
              onChange={handleInputChange}
              className="rounded-lg text-base"
            />
          </div>
          <div>
            <Label className="mb-1">หมวดหมู่</Label>
            {categoryLoading ? (
              <Skeleton className="h-9 w-full rounded-lg" />
            ) : (
              <Select
                items={categoryItems}
                name="category"
                disabled={categoryLoading}
                onValueChange={handleCategoryChange}
                value={transaction.categoryId}
              >
                <SelectTrigger className="w-full rounded-lg text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger>
                  <SelectGroup>
                    {categoryItems?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label className="mb-1">วันที่</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={transaction.transactionDate}
                onSelect={handleTransactionDateChange}
                className="rounded-lg"
                captionLayout="dropdown"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-evenly gap-2">
          <Button
            variant="destructive"
            disabled={buttonLoading}
            onClick={handleDeleteClick}
            className="flex-1 rounded-lg"
          >
            ลบ
          </Button>
          <Button
            variant="default"
            disabled={buttonLoading}
            onClick={handleEditSubmit}
            className="flex-1 rounded-lg"
          >
            บันทึก
          </Button>
        </div>
      </Card>
    </div>
  );
}
