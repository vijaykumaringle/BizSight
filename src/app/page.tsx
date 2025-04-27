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

    const defaultMetrics = {
    revenue: 100000,
    expenses: 50000,
    profit: 50000,
    currency: "INR",
    country:"India",
    deductionRate: 0.2,
    conversionRate:80,
    expenseBreakdown: "Office supplies: ₹5000, Travel: ₹10000, Software: ₹20000, Rent: ₹15000",
    incomeBreakdown: "Client A: ₹50000, Client B: ₹30000, Client C: ₹20000",
    

  };

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
          <DashboardHeader />
          <div className="grid gap-4 py-4">
            <DashboardMetrics
              revenue={defaultMetrics.revenue}
              expenses={defaultMetrics.expenses}
              profit={defaultMetrics.profit}
              currency={defaultMetrics.currency}
            />
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
                  <TaxInsights
                    income={defaultMetrics.revenue}
                    expenses={defaultMetrics.expenses}
                    currency={defaultMetrics.currency}
                    expenseBreakdown={defaultMetrics.expenseBreakdown}
                    incomeBreakdown={defaultMetrics.incomeBreakdown}
                    country={defaultMetrics.country}
                    conversionRate={defaultMetrics.conversionRate}
                    deductionRate={defaultMetrics.deductionRate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
