"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppError } from "@/lib/api/app-error";
import { useRouter } from "next/navigation";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { createCategory } from "./api/create-category";
import { CreateCategoryRequest, TransactionType } from "@/lib/api/generated";
import { handleApiError } from "@/lib/api/handle-api-error";

export default function CategoryPage() {
  const router = useRouter();
  const [error, setError] = useState<AppError>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [category, setCategory] = useState<CreateCategoryRequest>({
    name: "",
    transactionType: "Expense",
  });

  const transactionTypeItem = [
    { label: "Expense", value: "Expense" },
    { label: "Income", value: "Income" },
  ];

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (value.startsWith(" ") || value.includes("  ")) {
      return;
    }
    setCategory((prev) => ({ ...prev, name: value.trimEnd() }));
  }

  function handleTransactionTypeChange(value: TransactionType | null) {
    if (!value) {
      return;
    }
    setCategory((prev) => ({ ...prev, transactionType: value }));
  }

  async function handleCategorySubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const abortController = new AbortController();
    setButtonLoading(true);

    try {
      const response = await createCategory(category, abortController.signal);

      if (!response) {
        setError(
          new AppError("Something went wrong.", {
            type: "UNKNOWN_ERROR",
            cause: error,
          }),
        );
      }

      router.replace("/category");
    } catch (error) {
      throw handleApiError(error);
    } finally {
      if (!abortController.signal.aborted) {
        setButtonLoading(false);
      }
    }
  }

  return (
    <form onSubmit={handleCategorySubmit} className="w-full">
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
                value={category.name}
                onChange={handleNameChange}
                className="rounded-lg"
              />
            </div>

            <div>
              <Label className="mb-1">ประเภทรายการ</Label>
              <Select
                items={transactionTypeItem}
                name="transactionType"
                value={category.transactionType}
                onValueChange={handleTransactionTypeChange}
              >
                <SelectTrigger
                  className="w-full rounded-lg"
                  data-testid="transaction-type-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger>
                  {transactionTypeItem.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
