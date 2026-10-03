import { AddTransactionButton } from "@/components/add-transaction-button";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-svh">
      <ProtectedRoute>{children}</ProtectedRoute>
      <Link href="/transaction/add">
        <AddTransactionButton className="fixed right-0 bottom-0 m-7 h-10 p-5 text-center text-lg">
          เพิ่มรายการ
        </AddTransactionButton>
      </Link>
    </div>
  );
}
