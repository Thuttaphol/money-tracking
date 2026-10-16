"use client";

import Link from "next/link";
import { BalanceCard } from "./components/balance-card";
import { TransactionList } from "./components/transactions-list";
import { AddTransactionButton } from "@/components/add-button";
import { Plus } from "lucide-react";
import { TransactionPieChart } from "./components/transaction-chart";

export default function TransactionPage() {
  return (
    <div className="h-full w-full">
      <div className="flex h-full flex-col gap-4 p-4">
        <div>
          <BalanceCard />
        </div>
        <div>
          <TransactionPieChart />
        </div>
        <TransactionList />
      </div>
      <Link href="/transaction/add">
        <AddTransactionButton className="fixed right-0 bottom-0 m-6 size-14">
          <Plus />
        </AddTransactionButton>
      </Link>
    </div>
  );
}
