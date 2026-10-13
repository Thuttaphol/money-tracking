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

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="flex flex-row-reverse p-2">
        <ThemeToggle />
      </div>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>จัดการบัญชี</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/transaction">
              <SidebarMenuButton>รายการเงิน</SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/category">
              <SidebarMenuButton>ปรเภทรายการ</SidebarMenuButton>
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
