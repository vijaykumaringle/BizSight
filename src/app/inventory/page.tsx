"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/sidebar";
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

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}


export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const storedItems = localStorage.getItem("inventoryItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: newItemQuantity,
    };
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity(0);
    setIsModalOpen(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setIsModalOpen(true);
  };

  const handleSaveEditedItem = () => {
    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...item, name: newItemName, quantity: newItemQuantity }
            : item
        )
      );
      setEditingItem(null);
      setNewItemName("");
      setNewItemQuantity(0);
      setIsModalOpen(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewItemName("");
    setNewItemQuantity(0);
  };

  const pathname = usePathname();

  const isFormValid = newItemName.trim() !== "" && newItemQuantity >= 0;

    return (
        <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <MainNav pathname={pathname} />
              </SidebarHeader>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Inventory</h1>          
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-32">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Modify the item's name and quantity."
                      : "Enter the name and quantity of the new item."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="col-span-3"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItemQuantity}
                      onChange={(e) =>
                        setNewItemQuantity(parseInt(e.target.value))
                      }
                      className="col-span-3"
                      placeholder="Item quantity"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={
                      editingItem ? handleSaveEditedItem : handleAddItem
                    }
                    disabled={!isFormValid}
                  >
                    {editingItem ? "Save" : "Add"}
                  </Button>
                </div>
                
              </DialogContent>
            </Dialog>
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
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity.toString()}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => handleEditItem(item)}
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteItem(item.id)}
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
            <SidebarFooter />
          </Sidebar>
        </SidebarProvider>
    );
  }

