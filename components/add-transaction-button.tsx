"use client";

import { cn } from "cn";
import { Button } from "./ui/button";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AddTransactionButton({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button className={cn("rounded-lg", className)} {...props}>
      {children}
    </Button>
  );
}
