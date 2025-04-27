'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  MainNav,
} from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
import { ExpenseList } from '@/components/expense-list'; // Import the ExpenseList component
import { ExpenseTransaction } from '@/lib/data'; // Import ExpenseTransaction interface
import { useEffect, useState, useCallback } from 'react'; // Import necessary hooks
import { ExpenseForm } from '@/components/expense-form'; // Import the ExpenseForm component

export default function ExpensesPage() {
  const [expenseData, setExpenseData] = useState<ExpenseTransaction[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenseData(data);
      } else {
        console.error('Failed to fetch expense data');
      }
    } catch (error) {
      console.error('Error fetching expense data:', error);
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
            <CardTitle>Expense Transactions</CardTitle> 
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 py-4">
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                    <ExpenseForm onExpenseAdded={fetchData} />
                </Card>
                <Card className="col-span-1 md:col-span-1 lg:col-span-1">
                    <ExpenseList expenseTransactions={expenseData} />
                </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarProvider>
  );
}
