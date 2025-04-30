"use client";

import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, MainNav, SidebarFooter } from '@/components/sidebar';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InvoicesPage: React.FC = () => {
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
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
                Display Invoices Here
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarProvider>
  );
};

export default InvoicesPage;