'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '@/components/sidebar';
import { useUserCurrency } from '@/hooks/use-user-currency';
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
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePathname } from 'next/navigation';
import { Plus, Pencil, Trash, ArrowUpDown } from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryItem {
  id: string;
  name: string;
  image: string;
  imageUrl?: string;
  quantity: number;
  cost: number;
  price: number;
  sku: string;
}


export default function InventoryPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [newItemCost, setNewItemCost] = useState(0);
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemSKU, setNewItemSKU] = useState("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const currency = useUserCurrency();

  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const sortedItems = useMemo(() => {
    let sorted = [...items];

    if (searchTerm) {
      sorted = sorted.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const skuMatch = item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || skuMatch;
      });
    }

    if (sortBy) {
      sorted.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          return 0;
        }
      });
    }

    return sorted;
    }, [items, searchTerm, sortBy, sortOrder]);


  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [items]);

  const itemsToDisplay = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, itemsPerPage]);

  useEffect(() => {
    const storedItems = localStorage.getItem('inventoryItems');
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems) as InventoryItem[];
      const itemsWithImageUrls = parsedItems.map((item) => ({
        ...item, imageUrl: item.image ? item.image : undefined, // Add imageUrl property
      }));

      setItems(itemsWithImageUrls);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      image: newItemImage,
      quantity: newItemQuantity,
      cost: newItemCost,
      price: newItemPrice,
      sku: newItemSKU,
      imageUrl: newItemImage,
    };
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemQuantity(0);
    setNewItemSKU("");
    setIsModalOpen(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setNewItemCost(item.cost);
    setNewItemImage(item.image);
    setNewItemPrice(item.price);
      setNewItemSKU(item.sku);
    setIsModalOpen(true);
  };

  const handleSaveEditedItem = () => {
    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...item, name: newItemName, quantity: newItemQuantity, cost: newItemCost, price: newItemPrice, sku: newItemSKU, image: newItemImage, imageUrl: newItemImage } : item

        )
      );
      setEditingItem(null);
      setNewItemName("");
      setNewItemSKU("");
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
    setNewItemCost(0);
    setNewItemSKU("");
    setNewItemImage('');
    setNewItemPrice(0);
  };

  const pathname = usePathname();
  const isFormValid = newItemName.trim() !== '' && newItemQuantity >= 0 && newItemCost >= 0 && newItemPrice >= 0 && newItemSKU.trim() !== '';

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
                <h1 className="text-2xl font-bold">Inventory</h1>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingItem(null);
                        setNewItemName('');
                        setNewItemQuantity(0);
                        setNewItemCost(0);
                        setNewItemPrice(0);
                      }}
                    >
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
                        <Label htmlFor="image" className="text-right">
                          Image
                        </Label>
                        <div className="col-span-3">
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          {newItemImage && (
                            <img
                              src={newItemImage}
                              alt="Uploaded"
                              className="mt-2 w-20 h-20 object-cover rounded-md"
                            />
                          )}
                        </div>
                      </div>


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
                          <Label htmlFor="sku" className="text-right">
                              SKU
                          </Label>
                          <Input
                              id="sku"
                              value={newItemSKU}
                              onChange={(e) => setNewItemSKU(e.target.value)}
                              className="col-span-3"
                              placeholder="Item SKU"
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cost" className="text-right">
                          Cost
                        </Label>
                        <Input
                          id="cost"
                          type="number"
                          value={newItemCost}
                          onChange={(e) =>
                            setNewItemCost(parseInt(e.target.value))
                          }                            
                          className="col-span-3"
                          placeholder="Item cost"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(parseInt(e.target.value))}
                          className="col-span-3" placeholder="Item Price"/>
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
              
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }}>
                  Name
                  <ArrowUpDown className="ml-2 inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => { setSortBy('quantity'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }}>
                  Quantity
                  <ArrowUpDown className="ml-2 inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => { setSortBy('sku'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }}>
                  SKU
                  <ArrowUpDown className="ml-2 inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => { setSortBy('cost'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }}>
                  Cost
                  <ArrowUpDown className="ml-2 inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => { setSortBy('price'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc') }}>
                  Price
                  <ArrowUpDown className="ml-2 inline h-4 w-4" />
                </TableHead>
                <TableHead>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemsToDisplay.map((item) => (

                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="mr-2 h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    {item.name}
                  </TableCell>
                  <TableCell>
                  {item.quantity.toString()}
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    {item.cost !== undefined ? `${currency}${item.cost.toString()}` : ""}
                  </TableCell>
                  <TableCell>
                    {item.price !== undefined ? `${currency}${item.price.toString()}` : ""}
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingItem(item);
                        setNewItemName(item.name);
                        setNewItemQuantity(item.quantity);
                        setNewItemCost(item.cost);
                        setNewItemPrice(item.price);
                        setNewItemImage(item.image);
                        setNewItemSKU(item.sku);
                        setIsModalOpen(true);
                      }}
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
            <tfoot>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total Inventory Value:
                </TableCell>
                <TableCell className="font-bold">
                  {currency}
                  {totalValue.toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </tfoot>
          </Table>
          <Pagination>
            <PaginationContent
              onPageChange={(newPage) => {}}
              page={page}
              pageCount={Math.ceil(sortedItems.length / itemsPerPage)}
            />
          </Pagination>
        </div>
        </SidebarProvider>
    );
  }


