"use client";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
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
import { useState, useEffect, ChangeEvent } from "react";
import {
  Sidebar, 
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  MainNav,
} from "@/components/sidebar";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface OrderItem {
  skuId: string;
  quantity: number;
}
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  customer: string;
  date?: Date;
  items: { skuId: string; quantity: number }[];
}

export default function OrdersPage() {
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newItems, setNewItems] = useState<OrderItem[]>([]);
  const [newDate, setNewDate] = useState<Date | null>(null);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
      const storedInventory = localStorage.getItem("inventoryItems");
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory));
      }
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        const parsedOrders: Order[] = JSON.parse(storedOrders).map(
          (order: any) => ({
            ...order,
            date: order.date ? new Date(order.date) : undefined,
          })
        );
        setOrders(parsedOrders);
      }
  }, []);

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

  const calculateTotal = (orderItems: { skuId: string; quantity: number }[]) => {
    let total = 0;
    orderItems.forEach((item) => {
      const inventoryItem = inventory.find(
        (invItem) => invItem.id === item.skuId
      );
      if (inventoryItem) {

        total += inventoryItem.quantity * item.quantity;
      }
    });
    return total;
  };

  const handleAddOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customer: newCustomer,
      date: newDate || new Date(),
      items: newItems,
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);

    const updatedInventory = inventory.map((item) => {

      const orderedItem = newOrder.items.find((oi) => oi.skuId === item.id);
      if (orderedItem) {
        return {
          ...item,
          quantity: item.quantity - orderedItem.quantity,
        };
      }
      return item;
    });
    localStorage.setItem("inventoryItems", JSON.stringify(updatedInventory));
    setInventory(updatedInventory);
    setNewCustomer('');
    setNewDate(null);
    setNewItems([]);
    setIsModalOpen(false);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setNewDate(order.date);
    setNewCustomer(order.customer);
    setNewItems(order.items);
    setIsModalOpen(true);
  };

  const handleSaveEditedOrder = () => {
    if (editingOrder) {

      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id
          ? { ...order, customer: newCustomer, items: newItems }
          : order
      );
      setOrders(updatedOrders);
      const updatedInventory = updateInventoryAfterEdit(orders, updatedOrders);

      localStorage.setItem("inventoryItems", JSON.stringify(updatedInventory));
      setInventory(updatedInventory);

      setEditingOrder(null);
      setNewCustomer("");
      setNewDate(null);
      // setNewTotal(0); // setNewTotal is not defined, removing this line
      setIsModalOpen(false);
    }
  };

  const handleDeleteOrder = (id: string) => {
    const deletedOrder = orders.find((order) => order.id === id);
    if(deletedOrder){
        const updatedInventory = inventory.map((item) => {
          const orderedItem = deletedOrder.items.find(
            (oi) => oi.skuId === item.id
          );
          if (orderedItem) {
            return {
              ...item,
              quantity: item.quantity + orderedItem.quantity,
            };
          }
          return item;
        });
        localStorage.setItem("inventoryItems", JSON.stringify(updatedInventory));
        setInventory(updatedInventory);
        setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const isFormValid = newCustomer.trim() !== "" && newItems.length > 0 && newItems.every(item => item.skuId && item.quantity > 0); // Added check for valid items

  const handleAddItem = () => {
    setNewItems([...newItems, { skuId: "", quantity: 1 }]);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setNewCustomer("");
    setNewItems([]);
  };

  const updateInventoryAfterEdit = (
    oldOrders: Order[],
    newOrders: Order[]
  ) => {
    const oldOrder = oldOrders.find((o) => o.id === editingOrder?.id);
    const newOrder = newOrders.find((o) => o.id === editingOrder?.id);

    if (!oldOrder || !newOrder) {
      return inventory;
    }

    const oldOrderItems = oldOrder.items || [];
    const newOrderItems = newOrder.items || [];
    
    const updatedInventory = inventory.map((invItem) => {
      const oldOrderItem = oldOrderItems.find(
        (oi) => oi.skuId === invItem.id
      );
      const newOrderItem = newOrderItems.find(
        (oi) => oi.skuId === invItem.id
      );



      let quantityDifference = 0;
      if (oldOrderItem) {
        quantityDifference += oldOrderItem.quantity;
      }
      if (newOrderItem) {
        quantityDifference -= newOrderItem.quantity;
      }



      return {
        ...invItem,
        quantity: invItem.quantity + quantityDifference,
      };
    });

    return updatedInventory;
  }


  const handleItemChange = (
    index: number,
    field: "skuId" | "quantity",
    value: string | number
  ) => {
    const updatedItems = [...newItems];
    updatedItems[index][field] = field === "quantity" ? Number(value) : value;
    setNewItems(updatedItems);
  };

  return (<SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <MainNav pathname={pathname} />
          </SidebarHeader>
          <SidebarFooter />
      </Sidebar> 
      <div className="p-4 flex-1 overflow-auto"> {/* Added flex-1 and overflow-auto */} 
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Dialog open={isModalOpen} onOpenChange={handleModalClose}> {/* Changed to use handleModalClose */} 



            <DialogTrigger asChild>
              <Button className="w-32" onClick={() => setIsModalOpen(true)}> {/* Explicitly open modal */} 
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
                <div className="py-4">
                  {newItems.map((item, index) => (
                    <div
                      key={index} // Consider using a more stable key if items can be reordered
                      className="grid grid-cols-5 items-center gap-4 py-2" // Changed to grid-cols-5
                    >
                      <Label htmlFor={`sku-${index}`} className="text-right col-span-1"> {/* Adjusted span */} 
                        SKU
                      </Label>
                      {/* Wrapped Select in a div to apply col-span */}
                      <div className="col-span-2">
                       <select // Changed from custom Select to native select for simplicity with onChange
                        id={`sku-${index}`}
                        value={item.skuId}
                        onChange={(e) =>
                         handleItemChange(index, "skuId", e.target.value)
                        }
                         className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Added basic styling matching shadcn
                      >
                        <option value="">Select SKU</option>
                        {inventory.map((invItem) => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.name} (Qty: {invItem.quantity}) {/* Show quantity */}
                          </option>
                        ))}
                      </select>
                      </div>
                      <Label htmlFor={`quantity-${index}`} className="text-right col-span-1"> {/* Added Label for Quantity */} 
                        Qty
                      </Label>
                      <Input
                        id={`quantity-${index}`} // Added id for quantity
                        type="number"
                        min="1" // Prevent negative or zero quantity
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="col-span-1"
                      />
                       {/* Removed Trash icon here, maybe add it per line if needed */}
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddItem} className="mt-2"> {/* Added margin top */} 
                    Add Item
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={
                    editingOrder ? handleSaveEditedOrder : handleAddOrder
                  } disabled={!isFormValid}
                  
                >
                  {editingOrder ? "Save Changes" : "Add Order"} {/* More descriptive labels */}
                </Button>
                 <Button variant="outline" onClick={handleModalClose} className="ml-2"> {/* Added Cancel button */} 
                    Cancel
                  </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead> {/* Added Date column */} 
              <TableHead>Items</TableHead>
              
              <TableHead>Total Value (Est.)</TableHead> {/* Changed header to clarify */} 
              <TableHead className="text-right">Actions</TableHead> {/* Align Actions right */} 
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (<TableRow key={order.id}>
                <TableCell className="font-medium">{order.customer}</TableCell><TableCell>{order.date ? order.date.toLocaleDateString() : 'N/A'}</TableCell> {/* Display Date */}<TableCell>
                    {order.items.map(item => {
                        const inventoryItem = inventory.find(inv => inv.id === item.skuId);
                        const itemName = inventoryItem ? inventoryItem.name : "Unknown SKU"; // Handle unknown SKU
                        return <div key={`${order.id}-${item.skuId}`}>{itemName} x {item.quantity}</div>;
                      })}
                </TableCell>
                {/* Removed duplicate Item listing */}
                <TableCell>{calculateTotal(order.items)}</TableCell> {/* TODO: Clarify what this total represents - price or quantity? */} 
                <TableCell className="text-right"> {/* Align Actions right */} 
                  <Button
                    variant="ghost"
                    onClick={() => handleEditOrder(order)}
                    size="icon"
                    aria-label="Edit Order" // Added aria-label
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteOrder(order.id)}
                    size="icon"
                    aria-label="Delete Order" // Added aria-label
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
        {orders.length === 0 && ( // Added message for empty table
            <div className="text-center py-10 text-gray-500">No orders found.</div>
        )}
       </div>
    </SidebarProvider>
    );
};
