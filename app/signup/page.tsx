"use client";

import { useEffect } from "react";
import { SignupForm } from "@/app/signup/components/signup-form";
import { useAuthUser } from "../contexts/auth-context";
import { useRouter } from "next/navigation";

export default function SignupPage() {
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
      <SignupForm />
    </main>
  );
}
