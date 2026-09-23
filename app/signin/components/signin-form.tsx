"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type SubmitEvent } from "react";
import Link from "next/link";

import { FormState } from "@/definitions/signin-definitions";
import { validateSignin } from "../lib/signin";
import { useAuthUser } from "@/app/contexts/auth-context";

export function SigninForm() {
  const [isPending, setIsPending] = useState(false);
  const [formState, setFormState] = useState<FormState>(undefined);
  const { refreshUser } = useAuthUser();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email"));
    const password = formData.get("password");

    try {
      const validateResult = await validateSignin(email);
      if (!validateResult?.success) {
        setFormState(validateResult);
      }

      const response = await fetch(
        "http://localhost:5194/api/auth/login?useCookies=true",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );

      if (!response.ok) {
        console.log("login failed");
        return;
      }

      await refreshUser();
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>เข้าใช้งาน</CardTitle>
          <CardDescription>
            ระบุอีเมลและรหัสผ่านด้านล่าง เพื่อเข้าใช้งาน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="email@example.com"
                required
                defaultValue={formState?.values?.email}
              />
            </div>
            {formState?.errors?.email && (
              <p className="text-red-500">{formState.errors.email}</p>
            )}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">รหัสผ่าน</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" disabled={isPending} className="w-full">
            เข้าใช้งาน
          </Button>
          <div className="text-muted-foreground">หรือ</div>
          <Link href="/signup">สมัครใช้งาน</Link>
        </CardFooter>
      </Card>
    </form>
  );
}
