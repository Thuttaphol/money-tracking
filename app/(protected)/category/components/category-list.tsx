"use client";

import { Card } from "@/components/ui/card";
import { AppError } from "@/lib/api/app-error";
import { CategoryResponse } from "@/lib/api/generated";
import { useEffect, useState } from "react";
import { getAllCategory } from "../api/get-all-category";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { CategoryListSkeleton } from "./category-list-skeleton";

export function CategoryList() {
  const [error, setError] = useState<AppError>();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadCategory() {
      try {
        const categories = await getAllCategory(abortController.signal);

        setCategories(categories);
      } catch (error) {
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
        setLoading(false);
      }
    }

    loadCategory();
  }, []);

  if (error) {
    return (
      <Card className="flex h-full flex-1 flex-col items-center justify-center gap-4 overflow-auto p-2 text-base">
        <Label>ดาวน์โหลข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง</Label>
      </Card>
    );
  }

  return (
    <Card
      className="flex flex-1 flex-col gap-2 overflow-y-auto p-2"
      aria-busy={loading}
    >
      {loading ? (
        <CategoryListSkeleton />
      ) : categories.length === 0 ? (
        <Label className="flex h-full w-full justify-center">
          ยังไม่มีข้อมูล
        </Label>
      ) : (
        categories.map((category) => {
          return (
            <Link href={`/category/${category.id}`} key={category.id}>
              <CardHeader className="flex py-2 pl-4 text-base">
                <div className="flex-1">{category.name}</div>
                <ChevronRight className="" />
              </CardHeader>
            </Link>
          );
        })
      )}
    </Card>
  );
}
