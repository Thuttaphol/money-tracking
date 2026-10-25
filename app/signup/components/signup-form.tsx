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
import { useActionState } from "react";
import Link from "next/link";

import { signup } from "../lib/signup";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form className="w-full max-w-sm" action={action}>
      <Card>
        <CardHeader>
          <CardTitle>สมัครใช้งาน</CardTitle>
          <CardDescription>
            ระบุอีเมลและรหัสผ่านด้านล่าง เพื่อสมัครเข้าใช้งาน
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
                defaultValue={state?.values.email}
              />
            </div>
            {state?.errors?.email && (
              <p className="text-red-500">{state.errors.email}</p>
            )}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">รหัสผ่าน</Label>
              </div>
              <Input id="password" name="password" type="password" required />
              {state?.errors?.password && (
                <div>
                  <p className="text-red-500">Password must:</p>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li className="text-red-500" key={error}>
                        - {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex items-center">
                <Label htmlFor="password">ยืนยันรหัสผ่าน</Label>
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
              {state?.errors?.confirmPassword && (
                <p className="text-red-500">{state.errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" disabled={pending} className="w-full">
            สมัครใช้งาน
          </Button>
          <div className="text-muted-foreground">หรือ</div>
          <Link href="/signin">เข้าใช้งาน</Link>
        </CardFooter>
      </Card>
    </form>
  );
}
