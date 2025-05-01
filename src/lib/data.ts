export interface IncomeTransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  cost: number;
  price: number;
}

export interface ExpenseTransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
}