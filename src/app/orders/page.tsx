"use client";

import React from 'react';
import { SidebarProvider } from '@/components/sidebar'

import { DashboardHeader } from '@/components/dashboard-header';

export default function OrdersPage() {
  return (
    <SidebarProvider>
      <div className="flex-1 p-4">
        <div className="flex flex-col h-full">
          <DashboardHeader />
          <div className="py-4">
            <h1>Orders</h1>
            <p>Manage your orders here.</p>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}