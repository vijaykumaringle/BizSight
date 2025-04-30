"use client";

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  MainNav,
  SidebarFooter,
} from '@/components/sidebar';
import { usePathname } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          {/* Pass the pathname to MainNav */}
          <MainNav pathname={pathname} />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 p-4">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="bg-white shadow rounded p-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Your Name"
                defaultValue="John Doe"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Your Email"
                defaultValue="john.doe@example.com"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Update Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage;