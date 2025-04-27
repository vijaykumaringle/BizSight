import { ExpenseTransaction } from "@/lib/data";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

let expenseTransactions: ExpenseTransaction[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.date || !body.amount || !body.description || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newExpenseTransaction: ExpenseTransaction = {
      id: uuidv4(),
      date: new Date(body.date),
      amount: body.amount, // Amount is already parsed by Zod in the form
      description: body.description,
      category: body.category,
    };

    expenseTransactions.push(newExpenseTransaction);

    return NextResponse.json(newExpenseTransaction, { status: 201 }); // Use 201 for created

  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: "Invalid request body or server error" }, { status: 400 });
  }
}

export async function GET() {
  try {
      return NextResponse.json(expenseTransactions, { status: 200 });
  } catch (error) {
      console.error("Error processing GET request:", error);
      return NextResponse.json({ error: "Server error fetching expenses" }, { status: 500 });
  }
}
