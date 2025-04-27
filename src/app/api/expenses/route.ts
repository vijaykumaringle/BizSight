ts
import { ExpenseTransaction } from "@/lib/data";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let expenseTransactions: ExpenseTransaction[] = [];

export async function POST(request: Request) {
  const body = await request.json();

  const newExpenseTransaction: ExpenseTransaction = {
    id: uuidv4(),
    date: new Date(body.date),
    amount: body.amount,
    description: body.description,
    category: body.category,
  };

  expenseTransactions.push(newExpenseTransaction);

  return NextResponse.json(newExpenseTransaction, { status: 201 });
}

export async function GET() {
  return NextResponse.json(expenseTransactions, { status: 200 });
}