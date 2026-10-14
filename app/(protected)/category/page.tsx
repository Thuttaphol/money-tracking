"use client";

import { AddTransactionButton } from "@/components/add-button";
import { CategoryList } from "./components/category-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  return (
    <div className="w-full p-4">
      <CategoryList />
      <Link href="/category/add">
        <AddTransactionButton className="fixed right-0 bottom-0 m-6 size-14">
          <Plus />
        </AddTransactionButton>
      </Link>
    </div>
  );
}
