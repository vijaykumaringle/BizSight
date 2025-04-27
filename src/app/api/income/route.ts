import { IncomeTransaction } from "@/lib/data";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let incomeTransactions: IncomeTransaction[] = [];

export async function POST(request: Request) {
  const body = await request.json();

  const newIncomeTransaction: IncomeTransaction = {
    id: uuidv4(),
    date: new Date(body.date),
    amount: body.amount,
    description: body.description,
    category: body.category,
  };

  incomeTransactions.push(newIncomeTransaction);

    return NextResponse.json(newIncomeTransaction, { status: 201 });
}

export async function GET() {
    return NextResponse.json(incomeTransactions, { status: 200 });
}