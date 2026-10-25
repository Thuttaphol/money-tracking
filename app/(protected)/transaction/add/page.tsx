"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, type SubmitEvent, useEffect, useState } from "react";
import { getCategories } from "./api/get-categories";
import { AppError } from "@/lib/api/app-error";
import { handleApiError } from "@/lib/api/handle-api-error";
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
import { createTransaction } from "./api/create-transation";
import { CreateTransactionRequest } from "@/lib/api/generated";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function TransactionPage() {
  const router = useRouter();
  const [error, setError] = useState<AppError>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryItems, setCategoryItems] =
    useState<{ label: string; value: number }[]>();
  const [transaction, setTransaction] = useState({
    title: "",
    description: "",
    amount: "",
    categoryId: 1,
    transactionDate: new Date(),
  });

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

  async function handleTransactionSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const abortController = new AbortController();

    const payload: CreateTransactionRequest = {
      title: transaction.title,
      description: transaction.description,
      amount: Number(transaction.amount),
      categoryId: transaction.categoryId,
      transactionDate: new Date(transaction.transactionDate).toISOString(),
    };

    try {
      setButtonLoading(true);

      const response = await createTransaction(payload, abortController.signal);

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
    } finally {
      if (!abortController.signal.aborted) {
        setButtonLoading(false);
      }
    }
  }

  return (
    <form onSubmit={handleTransactionSubmit} className="w-full">
      <div className="flex h-svh">
        <Card className="m-4 flex w-full flex-col p-2">
          <CardHeader className="flex w-full justify-center text-lg">
            ระบุรายละเอียด
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
                  defaultValue={categoryItems![0].value}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full rounded-lg text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger>
                    {categoryItems?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
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
          <div className="flex justify-evenly gap-4">
            <Button
              disabled={buttonLoading}
              type="submit"
              className="w-full rounded-lg"
            >
              บันทึก
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
}
