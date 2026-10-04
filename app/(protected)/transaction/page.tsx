"use client";

import Link from "next/link";
import { BalanceCard } from "./components/balance-card";
import { TransactionList } from "./components/transactions-list";
import { AddTransactionButton } from "@/components/add-transaction-button";

export default function TransactionPage() {
  return (
    <>
      <div className="flex h-full flex-col gap-4 p-4">
        <BalanceCard />
        <TransactionList />
      </div>
      <Link href="/transaction/add">
        <AddTransactionButton className="fixed right-0 bottom-0 m-3 h-10 p-5 text-center text-lg">
          เพิ่มรายการ
        </AddTransactionButton>
      </Link>
    </>
  );
}
