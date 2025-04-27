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
      amount: body.amount,
      description: body.description,
      category: body.category,
    };

    expenseTransactions.push(newExpenseTransaction);

    // Return 201 Created for successful resource creation
    return NextResponse.json(newExpenseTransaction, { status: 201 });

  } catch (error) {
    console.error("Error processing POST request:", error);
     if (error instanceof SyntaxError) { // Check specifically for JSON parsing errors
       return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
     }
     // Generic server error
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
      return NextResponse.json(expenseTransactions, { status: 200 });
  } catch (error) {
       console.error("Error processing GET request:", error);
       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
