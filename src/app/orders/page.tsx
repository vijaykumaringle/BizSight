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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
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
import { useState, useEffect, ChangeEvent, useCallback } from "react";
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

interface Order {
  id: string;
  customer: string;
  date?: Date;
  items: OrderItem[];
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

  // Load inventory and orders from local storage on component mount
  useEffect(() => {
    const storedInventory = localStorage.getItem("inventoryItems");
    if (storedInventory) {
      try {
        setInventory(JSON.parse(storedInventory));
      } catch (error) {
        console.error("Failed to parse inventory from localStorage", error);
        setInventory([]); // Reset to empty array on error
      }
    }

    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        const parsedOrders: Order[] = JSON.parse(storedOrders).map(
          (order: any) => ({
            ...order,
            // Ensure date is parsed correctly, handle potential invalid dates
            date: order.date && !isNaN(new Date(order.date).getTime()) ? new Date(order.date) : undefined,
            items: Array.isArray(order.items) ? order.items : [], // Ensure items is an array
          })
        );
        setOrders(parsedOrders);
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
        setOrders([]); // Reset to empty array on error
      }
    }
  }, []);

  // Save orders to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Save inventory to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(inventory));
  }, [inventory]);

  const calculateTotal = useCallback((orderItems: OrderItem[]) => {
    let total = 0;
    orderItems.forEach((item) => {
      const inventoryItem = inventory.find(
        (invItem) => invItem.id === item.skuId
      );
      // Assuming quantity in inventory is price for now - needs clarification
      if (inventoryItem && typeof inventoryItem.quantity === 'number' && typeof item.quantity === 'number') {
        // This calculation seems wrong - it multiplies inventory quantity by order quantity.
        // It should likely involve a price. For now, let's just sum order quantities as a placeholder.
        // total += inventoryItem.quantity * item.quantity; // Placeholder logic - Needs Price
         total += item.quantity; // Example: Summing quantities instead of value
      }
    });
    // return total; // Returning the sum of quantities for now
    return `~${total} items`; // Displaying item count as placeholder
  }, [inventory]);


  const resetForm = () => {
    setEditingOrder(null);
    setNewCustomer("");
    setNewItems([]);
    setNewDate(null);
  };

  const handleAddOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customer: newCustomer,
      date: newDate || new Date(),
      items: newItems,
    };

    // Update inventory: Subtract ordered quantities
    const updatedInventory = inventory.map((invItem) => {
      const orderedItem = newItems.find((oi) => oi.skuId === invItem.id);
      if (orderedItem) {
        // Ensure quantity doesn't go below zero
        const newQuantity = Math.max(0, invItem.quantity - orderedItem.quantity);
        return { ...invItem, quantity: newQuantity };
      }
      return invItem;
    }).filter(item => item); // Ensure filter returns correct type if needed, though map should suffice

    setInventory(updatedInventory);
    setOrders((prevOrders) => [...prevOrders, newOrder]); // Update orders state
    resetForm(); // Reset form fields
    setIsModalOpen(false); // Close modal
  };


  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setNewCustomer(order.customer);
    // Deep copy items to avoid direct state mutation issues
    setNewItems(order.items.map(item => ({ ...item })));
    setNewDate(order.date ? new Date(order.date) : null); // Ensure date is a Date object or null
    setIsModalOpen(true);
  };


  const updateInventoryAfterEdit = useCallback((oldOrder: Order, newOrder: Order) => {
    // Calculate the difference in item quantities between old and new order
    const quantityChanges: { [skuId: string]: number } = {};

    // Add back quantities from the old order
    oldOrder.items.forEach(item => {
      quantityChanges[item.skuId] = (quantityChanges[item.skuId] || 0) + item.quantity;
    });

    // Subtract quantities from the new order
    newOrder.items.forEach(item => {
      quantityChanges[item.skuId] = (quantityChanges[item.skuId] || 0) - item.quantity;
    });

    // Apply the net changes to the inventory
    const updatedInventory = inventory.map(invItem => {
      if (quantityChanges[invItem.id]) {
        const newQuantity = Math.max(0, invItem.quantity + quantityChanges[invItem.id]);
        return { ...invItem, quantity: newQuantity };
      }
      return invItem;
    });

    setInventory(updatedInventory);
  }, [inventory]); // Dependency array includes inventory


  const handleSaveEditedOrder = () => {
    if (!editingOrder) return;

    const updatedOrder: Order = {
      ...editingOrder,
      customer: newCustomer,
      items: newItems,
      date: newDate || editingOrder.date, // Keep original date if new one isn't set
    };

    // Find the original order state before edit
    const originalOrder = orders.find(o => o.id === editingOrder.id);
    if (!originalOrder) return; // Should not happen if editingOrder is set

    // Update inventory based on the difference
    updateInventoryAfterEdit(originalOrder, updatedOrder);

    // Update the orders list
    setOrders(orders.map((order) =>
      order.id === editingOrder.id ? updatedOrder : order
    ));

    resetForm(); // Reset form state
    setIsModalOpen(false); // Close modal
  };

  const handleDeleteOrder = (id: string) => {
    const orderToDelete = orders.find((order) => order.id === id);
    if (orderToDelete) {
      // Update inventory: Add back the quantities of the deleted order
      const updatedInventory = inventory.map((invItem) => {
        const deletedItem = orderToDelete.items.find(
          (oi) => oi.skuId === invItem.id
        );
        if (deletedItem) {
          return { ...invItem, quantity: invItem.quantity + deletedItem.quantity };
        }
        return invItem;
      });
      setInventory(updatedInventory); // Update inventory state
      setOrders(orders.filter((order) => order.id !== id)); // Update orders state
    }
  };

  // Validation for the form submission button
  const isFormValid = newCustomer.trim() !== "" && newItems.length > 0 && newItems.every(item => item.skuId && item.quantity > 0);

  const handleAddItem = () => {
    setNewItems([...newItems, { skuId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: "skuId" | "quantity",
    value: string | number
  ) => {
    const updatedItems = [...newItems];
    const itemToUpdate = { ...updatedItems[index] }; // Create a copy

    if (field === "quantity") {
        // Ensure quantity is not negative, default to 1 if invalid
        const quantity = Number(value);
        itemToUpdate.quantity = quantity > 0 ? quantity : 1;
    } else { // field === "skuId"
        itemToUpdate.skuId = String(value);
    }

    updatedItems[index] = itemToUpdate; // Update the array with the modified copy
    setNewItems(updatedItems);
  };


  // Handles opening/closing the dialog and resets form when closing
  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      resetForm(); // Reset form when dialog closes
    }
  };

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <MainNav pathname={pathname} />
          </SidebarHeader>
          <SidebarFooter />
      </Sidebar>
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          {/* Dialog controlled by isModalOpen state */}
          <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            {/* DialogTrigger just needs to be present */}
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
                {/* Customer Input */}
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
                {/* Date Input */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDate ? newDate.toISOString().split('T')[0] : ""}
                    onChange={(e) => setNewDate(e.target.value ? new Date(e.target.value) : null)}
                    className="col-span-3"
                  />
                </div>
                {/* Items Section */}
                <div className="py-4">
                  <Label>Items</Label>
                  {newItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 items-center gap-2 py-2" // Use grid-cols-6 for better alignment
                    >
                      {/* SKU Select */}
                      <div className="col-span-3">
                        <Select
                           value={item.skuId}
                           onValueChange={(value) => handleItemChange(index, "skuId", value)}
                        >
                           <SelectTrigger>
                             <SelectValue placeholder="Select SKU" />
                           </SelectTrigger>
                           <SelectContent>
                             {inventory.map((invItem) => (
                               <SelectItem key={invItem.id} value={invItem.id} disabled={invItem.quantity <= 0 && !editingOrder?.items.find(i => i.skuId === invItem.id)}>
                                 {invItem.name} (Qty: {invItem.quantity})
                               </SelectItem>
                             ))}
                           </SelectContent>
                        </Select>
                      </div>
                      {/* Quantity Input */}
                       <div className="col-span-2">
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(index, "quantity", e.target.value)
                              }
                              placeholder="Qty"
                            />
                      </div>
                      {/* Remove Item Button */}
                      <div className="col-span-1 flex justify-end">
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => handleRemoveItem(index)}
                             aria-label="Remove item"
                           >
                             <Trash className="h-4 w-4 text-red-500" />
                           </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddItem} className="mt-2 w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Item Line
                  </Button>
                </div>
              </div>
              {/* Dialog Footer with Submit/Cancel */}
              <div className="flex justify-end gap-2">
                 <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                <Button
                  onClick={
                    editingOrder ? handleSaveEditedOrder : handleAddOrder
                  } disabled={!isFormValid}

                >
                  {editingOrder ? "Save Changes" : "Add Order"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Orders Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Value (Est.)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.customer}</TableCell>
                <TableCell>{order.date ? order.date.toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>
                    {order.items.map(item => {
                        const inventoryItem = inventory.find(inv => inv.id === item.skuId);
                        const itemName = inventoryItem ? inventoryItem.name : `Unknown SKU (${item.skuId})`;
                        return <div key={`${order.id}-${item.skuId}`}>{itemName} x {item.quantity}</div>;
                      })}
                </TableCell>
                <TableCell>{calculateTotal(order.items)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditOrder(order)}
                    size="icon"
                    aria-label="Edit Order"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteOrder(order.id)}
                    size="icon"
                    aria-label="Delete Order"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
             ))
             ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
       </div>
    </SidebarProvider>
    );
};
