"use client";

import { BalanceCard } from "./components/balance-card";
import { TransactionList } from "./components/transactions-list";

export default function TransactionPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <BalanceCard />
      <TransactionList />
    </div>
  );
}
