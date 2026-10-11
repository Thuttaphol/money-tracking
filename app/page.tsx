"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthUser } from "../app/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoading, isAuthenticated } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/transaction");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return;
  }

  return (
    <div>
      <main className="flex h-dvh flex-col items-center justify-center">
        <div className="fixed top-2 right-2">
          <ThemeToggle />
        </div>
        <div className="text-center text-6xl font-bold">
          <p>แอพจด</p>
          <p>
            รายรับ
            <br />
            รายจ่าย
          </p>
        </div>
        <Link href="/transaction">
          <Button className="mt-10 rounded-lg p-8 text-3xl">เข้าใช้งาน</Button>
        </Link>
      </main>
    </div>
  );
}
