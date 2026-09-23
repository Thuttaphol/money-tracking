"use client";

import { useEffect } from "react";
import { SigninForm } from "@/app/signin/components/signin-form";
import { useAuthUser } from "../contexts/auth-context";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const { isAuthenticated, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/transaction");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="flex h-dvh items-center justify-center">
      <SigninForm />
    </main>
  );
}
