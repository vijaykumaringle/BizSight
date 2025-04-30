"use client";
"use client";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  MainNav,
  SidebarFooter,
} from "@/components/sidebar";
import { AppointmentCalendar } from "@/components/appointment-calendar";
import { usePathname } from "next/navigation";

export default function CalendarPage() {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <MainNav pathname={pathname} />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 p-4">
        <AppointmentCalendar />
      </div>
    </SidebarProvider>
  );
}
