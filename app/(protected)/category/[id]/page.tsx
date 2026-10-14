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
import { ChangeEvent, use, useEffect, useState } from "react";
import {
  CategoryResponse,
  TransactionType,
  UpdateCategoryRequest,
} from "@/lib/api/generated";
import { handleApiError } from "@/lib/api/handle-api-error";
import { getCategoryById } from "./api/get-category-by-id";
import { deleteCategory } from "./api/delete-category";
import { updateCategory } from "./api/update-category";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [category, setCategory] = useState<CategoryResponse>({
    id: 0,
    name: "",
    transactionType: "Expense",
  });

  useEffect(() => {
    const abortController = new AbortController();

    async function loadCategory(id: number) {
      try {
        const category = await getCategoryById(id, abortController.signal);

        if (abortController.signal.aborted) return;

        setCategory(category);
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

    loadCategory(Number(id));
  }, []);

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

  async function handleEditSubmit() {
    const abortController = new AbortController();

    const transactionRequest: UpdateCategoryRequest = {
      id: category.id,
      name: category.name,
      transactionType: category.transactionType,
    };
    try {
      const response = await updateCategory(
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

      router.push("/category");
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async function handleDeleteClick() {
    const abortController = new AbortController();

    setButtonLoading(true);

    try {
      const response = await deleteCategory(
        category.id,
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

      router.replace("/category");
    } catch (error) {
      throw handleApiError(error);
    }
  }

  if (loading) {
    // return <TransactionPageSkeleton />;
  }

  if (error || !category) {
    return (
      <div className="flex h-svh">
        <Card className="m-4 flex flex-1 items-center justify-center gap-4 p-2 text-base">
          <Label>ดาวน์โหลข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง</Label>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-svh w-full">
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
            <Label className="mb-1">หมวดหมู่</Label>
            <Select
              items={transactionTypeItem}
              name="category"
              value={category.transactionType}
              onValueChange={handleTransactionTypeChange}
            >
              <SelectTrigger className="w-full rounded-lg">
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
