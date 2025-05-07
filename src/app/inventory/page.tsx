'use client'
import { useState, useEffect, useMemo, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { usePathname } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  MainNav,
  SidebarTrigger
} from '@/components/sidebar';

import { Button } from '@/components/ui/button';
import { useUserCurrency } from '@/hooks/use-user-currency';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableFooter } from '@/components/ui/table';


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Plus, Pencil, Trash, ArrowUpDown, Image as ImageIcon } from 'lucide-react';

interface InventoryItem {
  name: string;
  id: string;
  image: string; 
  imageUrl?: string; 
  quantity: number;
  cost: number;
  price: number;
  sku: string;
}

export default function InventoryPage() {
  const { currency } = useUserCurrency();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(0);
  const [newItemCost, setNewItemCost] = useState(0);
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemSKU, setNewItemSKU] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const pathname = usePathname();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sortedItems = useMemo(() => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const skuMatch = item.sku
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return nameMatch || skuMatch;
      });
    }
    if (sortBy !== null) {
      filtered.sort((a, b) => {
        let comparison = 0;
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    return filtered;
  }, [items, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const itemsToDisplay = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSort = (newSortBy: keyof InventoryItem) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    const storedItems = localStorage.getItem('inventoryItems');
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (e) {
        console.error("Failed to parse inventory items from localStorage", e);
        initializeDefaultItems();
      }
    } else {
      initializeDefaultItems();
    }
  }, []);

  const initializeDefaultItems = () => {
    const initialItems: InventoryItem[] = [
      {
        id: '1',
        name: 'Laptop',
        image: 'https://picsum.photos/seed/laptop/50/50', 
        imageUrl: 'https://picsum.photos/seed/laptop/50/50',
        quantity: 10,
        cost: 500,
        price: 1000,
        sku: 'LAPTOP001',
      },
      {
        id: '2',
        name: 'Mouse',
        image: 'https://picsum.photos/seed/mouse/50/50',
        imageUrl: 'https://picsum.photos/seed/mouse/50/50',
        quantity: 50,
        cost: 5,
        price: 10,
        sku: 'MOUSE001',
      },
      {
        id: '3',
        name: 'Keyboard',
        image: 'https://picsum.photos/seed/keyboard/50/50',
        imageUrl: 'https://picsum.photos/seed/keyboard/50/50',
        quantity: 30,
        cost: 20,
        price: 50,
        sku: 'KEYBOARD001',
      },
    ];
    localStorage.setItem('inventoryItems', JSON.stringify(initialItems));
    setItems(initialItems);
  };

  useEffect(() => {
    if (items.length > 0 || localStorage.getItem('inventoryItems') !== null) {
        localStorage.setItem('inventoryItems', JSON.stringify(items));
    }
  }, [items]);

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      image: newItemImage, 
      imageUrl: newItemImage, 
      quantity: newItemQuantity,
      cost: newItemCost,
      price: newItemPrice,
      sku: newItemSKU,
    };
    setItems(prevItems => [...prevItems, newItem]);
    resetFormFields();
    setIsModalOpen(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setNewItemCost(item.cost);
    setNewItemPrice(item.price);
    setNewItemSKU(item.sku);
    setNewItemImage(item.image); 
    setIsModalOpen(true);
  };

  const handleSaveEditedItem = () => {
    if (editingItem == null) return;
    setItems(currentItems =>
      currentItems.map((item) =>
        item.id === editingItem.id
          ? {
            ...item,
            name: newItemName,
            quantity: newItemQuantity,
            cost: newItemCost,
            price: newItemPrice,
            sku: newItemSKU,
            image: newItemImage, 
            imageUrl: newItemImage,
          }
          : item
      )
    );
    resetFormFields();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(currentItems => currentItems.filter((item) => item.id !== id));
  };

  const resetFormFields = () => {
    setNewItemName('');
    setNewItemImage('');
    setNewItemQuantity(0);
    setNewItemCost(0);
    setNewItemPrice(0);
    setNewItemSKU('');
    if (inputRef.current) {
      inputRef.current.value = ''; 
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) { // If the dialog is closing
      setEditingItem(null);
      resetFormFields();
    }
  };

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [items]);

  const isFormValid =
    newItemName.trim() !== '' &&
    newItemQuantity >= 0 &&
    newItemCost >= 0 &&
    newItemPrice >= 0 &&
    newItemSKU.trim() !== '';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <MainNav pathname={pathname} />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Inventory</h1>
          <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <form onSubmit={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Modify the item's details."
                      : 'Enter the details of the new item.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image-upload" className="text-right">
                      Image
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <Input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={inputRef}
                        className="py-2"
                      />
                      {newItemImage && (
                        <img
                          data-ai-hint="product image"
                          style={{
                            width: '50px',
                            height: '50px',
                          }}
                          src={newItemImage}
                          alt="Uploaded item"
                          className="ml-2 w-12 h-12 object-cover rounded-md shadow-sm"
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
                        setNewItemQuantity(Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="col-span-3"
                      placeholder="Item quantity"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost ({currency})
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      value={newItemCost}
                      onChange={(e) =>
                        setNewItemCost(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="col-span-3"
                      placeholder="Item cost"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price ({currency})
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={newItemPrice}
                      onChange={(e) =>
                        setNewItemPrice(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="col-span-3"
                      placeholder="Item Price"
                    />
                  </div>
                </div>
                <DialogFooter className="pt-6">
                  <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                  <Button
                    onClick={editingItem ? handleSaveEditedItem : handleAddItem}
                    disabled={!isFormValid}
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 lg:w-1/3"
          />
        </div>

        <div className="overflow-x-auto rounded-md border">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="border-b bg-muted/50">
                <TableHead className="cursor-pointer px-4 py-3" onClick={() => handleSort('image')}>
                    Image
                </TableHead>
                <TableHead className="cursor-pointer px-4 py-3" onClick={() => handleSort('name')}>
                  Name <ArrowUpDown className="ml-2 inline h-3 w-3" />
                </TableHead>
                <TableHead className="cursor-pointer px-4 py-3 text-right" onClick={() => handleSort('quantity')}>
                  Quantity <ArrowUpDown className="ml-2 inline h-3 w-3" />
                </TableHead>
                <TableHead className="cursor-pointer px-4 py-3" onClick={() => handleSort('sku')}>
                  SKU <ArrowUpDown className="ml-2 inline h-3 w-3" />
                </TableHead>
                <TableHead className="cursor-pointer px-4 py-3 text-right" onClick={() => handleSort('cost')}>
                  Cost <ArrowUpDown className="ml-2 inline h-3 w-3" />
                </TableHead>
                <TableHead className="cursor-pointer px-4 py-3 text-right" onClick={() => handleSort('price')}>
                  Price <ArrowUpDown className="ml-2 inline h-3 w-3" />
                </TableHead>
                <TableHead className="px-4 py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemsToDisplay.map((item) => (
                <TableRow key={item.id} className="border-b hover:bg-muted/20">
                  <TableCell className="px-4 py-2">
                    {item.imageUrl ? ( 
                      <img
                        data-ai-hint="product thumbnail"
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover shadow-sm"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium px-4 py-2 break-words">{item.name}</TableCell>
                  <TableCell className="px-4 py-2 text-right break-words">{item.quantity.toString()}</TableCell>
                  <TableCell className="px-4 py-2 break-words">{item.sku}</TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {item.cost !== undefined ? `${currency}${item.cost.toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {item.price !== undefined ? `${currency}${item.price.toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleEditItem(item)}
                        size="icon"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        size="icon"
                        aria-label={`Delete ${item.name}`}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
               {itemsToDisplay.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No inventory items found. Add new items or adjust your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t bg-muted/50">
                <TableCell colSpan={5} className="text-right font-bold py-3 px-4">
                  Total Inventory Value:
                </TableCell>
                <TableCell className="font-bold px-4 py-3 text-right" colSpan={2}>
                  {currency}{totalValue.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 p-4 rounded-md border">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    // @ts-ignore 
                    disabled={page === 1} 
                    className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink 
                      onClick={() => handlePageChange(p)}
                      // @ts-ignore 
                      isActive={page === p}
                      className={page === p ? "font-bold bg-primary text-primary-foreground" : ""}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    // @ts-ignore 
                    disabled={page === totalPages}
                    className={page === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}