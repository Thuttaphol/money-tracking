"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <div className="flex flex-row-reverse p-2">
        <ThemeToggle />
      </div>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar}>
              จัดการบัญชี
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/transaction">
              <SidebarMenuButton onClick={toggleSidebar}>
                รายการเงิน
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/category">
              <SidebarMenuButton onClick={toggleSidebar}>
                ประเภทรายการ
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Will implement to separate component */}
        <Button variant="destructive" className="p-4">
          ลงชื่อออก
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
