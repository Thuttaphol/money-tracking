import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-dvh w-full">
          <AppSidebar />
          <div className="fixed">
            <SidebarTrigger size="lg" />
          </div>
          {children}
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
