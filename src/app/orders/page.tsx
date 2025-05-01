"use client";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  MainNav,
} from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname } from "next/navigation";
import { Plus, Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
interface Order {
  id: string;
  customer: string;
  date: Date;
  total: number;
}

export default function OrdersPage() {
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newTotal, setNewTotal] = useState(0);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const parsedOrders: Order[] = JSON.parse(storedOrders).map(
        (order: Order) => ({
          ...order,
          date: new Date(order.date),
        })
      );
      setOrders(parsedOrders);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customer: newCustomer,
      date: newDate || new Date(),
      total: newTotal,
    };
    setOrders([...orders, newOrder]);
    setNewCustomer("");
    setNewDate(null);
    setNewTotal(0);
    setIsModalOpen(false);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setNewCustomer(order.customer);
    setNewDate(order.date);
    setNewTotal(order.total);
    setIsModalOpen(true);
  };

  const handleSaveEditedOrder = () => {
    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id
            ? { ...order, customer: newCustomer, date: newDate || new Date(), total: newTotal }
            : order
        )
      );
      setEditingOrder(null);
      setNewCustomer("");
      setNewDate(null);
      setNewTotal(0);
      setIsModalOpen(false);
    }
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setNewCustomer("");
    setNewDate(null);
    setNewTotal(0);
  };

  const isFormValid = newCustomer.trim() !== "" && newTotal >= 0;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <MainNav pathname={pathname} />
        </SidebarHeader>
        <SidebarFooter />
      </Sidebar>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-32">
                <Plus className="mr-2 h-4 w-4" />
                Add Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingOrder ? "Edit Order" : "Add New Order"}
                </DialogTitle>
                <DialogDescription>
                  {editingOrder
                    ? "Modify the order's details."
                    : "Enter the order details."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Input
                    id="customer"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="col-span-3"
                    placeholder="Customer name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDate ? newDate.toISOString().split('T')[0] : ""}
                    onChange={(e) => setNewDate(new Date(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="total" className="text-right">
                    Total
                  </Label>
                  <Input
                    id="total"
                    type="number"
                    value={newTotal.toString()}
                    onChange={(e) => setNewTotal(parseInt(e.target.value))}
                    className="col-span-3"
                    placeholder="Order total"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={
                    editingOrder ? handleSaveEditedOrder : handleAddOrder
                  }
                  disabled={!isFormValid}
                >
                  {editingOrder ? "Save" : "Add"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.customer}</TableCell>
                <TableCell>
                  {order.date.toLocaleDateString()}
                </TableCell>
                <TableCell>{order.total.toString()}</TableCell>
                <TableCell className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditOrder(order)}
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteOrder(order.id)}
                    size="icon"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SidebarProvider>
  );
};