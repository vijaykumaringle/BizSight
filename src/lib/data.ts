export interface IncomeTransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
}

export interface ExpenseTransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
}