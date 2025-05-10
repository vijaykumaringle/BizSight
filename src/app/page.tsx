"use client"; // Required for using hooks like usePathname

import { usePathname } from 'next/navigation'; // Import usePathname
import {DashboardHeader} from '@/components/dashboard-header';
import {DashboardMetrics} from '@/components/dashboard-metrics';
import {AppointmentCalendar} from '@/components/appointment-calendar';
import {TaxInsights} from '@/components/tax-insights';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {SidebarProvider, Sidebar, SidebarContent, MainNav} from '@/components/sidebar';

export default function Home() {
  const pathname = usePathname(); // Get the current pathname
  const userName = "John Doe"; // Placeholder user name

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          {/* Pass the pathname to MainNav */}
          <MainNav pathname={pathname} />
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-4">
        <div className="flex flex-col h-full">
          <DashboardHeader userName={userName} />
          <div className="grid gap-4 py-4">
            <DashboardMetrics />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Appointment Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <AppointmentCalendar />
                </CardContent>
              </Card>
              <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Tax Deduction Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxInsights />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
