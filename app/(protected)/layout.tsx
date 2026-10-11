import { ProtectedRoute } from "@/components/auth/protected-route";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="h-svh">
        <div className="fixed top-1 right-1">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
