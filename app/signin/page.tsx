"use client";

import { SigninForm } from "@/app/signin/components/signin-form";
import { useAuthUser } from "@/app/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SigninPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null;
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
