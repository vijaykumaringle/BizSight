'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  MainNav,
} from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { IncomeList } from "@/components/income-list"; // Import the IncomeList component
import { IncomeTransaction } from "@/lib/data"; // Import IncomeTransaction interface
import { useEffect, useState, useCallback } from "react"; // Import necessary hooks
import { IncomeForm } from "@/components/income-form"; // Import the IncomeForm component

export default function IncomePage() {
  const [incomeData, setIncomeData] = useState<IncomeTransaction[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/income");
      if (response.ok) {
        const data = await response.json();
        setIncomeData(data);
      } else {
        console.error("Failed to fetch income data");
      }
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>  
      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Income Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 py-4">
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                    <IncomeForm onIncomeAdded={fetchData} />
                </Card>
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                    <IncomeList incomeTransactions={incomeData} />
                </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarProvider>
  );
}
