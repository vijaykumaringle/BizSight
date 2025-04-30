"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    MainNav,
  } from "@/components/sidebar";
  import { usePathname } from "next/navigation";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Plus } from "lucide-react";
  
  interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
  }
  
  export default function InventoryPage() {
    const pathname = usePathname();
    const [items, setItems] = useState<InventoryItem[]>([
      { id: "1", name: "Item 1", quantity: 10 },
      { id: "2", name: "Item 2", quantity: 20 },
      { id: "3", name: "Item 3", quantity: 30 },
    ]);
  
    const handleAddItem = () => {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: "New Item",
        quantity: 0,
      };
      setItems([...items, newItem]);
    };

    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <MainNav pathname={pathname} />
          </SidebarHeader>
          <SidebarContent>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Inventory</h1>
              <Button onClick={handleAddItem} className="w-32">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );
  }