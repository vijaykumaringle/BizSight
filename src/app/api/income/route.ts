import { IncomeTransaction } from "@/lib/data";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

let incomeTransactions: IncomeTransaction[] = []

export async function POST(request: Request) {
    try {
      const body = await request.json();

      // Basic validation (you should have more robust validation in a real app)
        if (!body.date || !body.amount || !body.description || !body.category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newIncomeTransaction: IncomeTransaction = {
            id: uuidv4(),
            date: new Date(body.date),
            amount: body.amount,
            description: body.description,
            category: body.category,
        };

        incomeTransactions.push(newIncomeTransaction)

        return NextResponse.json(newIncomeTransaction, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function GET() {
    return NextResponse.json(incomeTransactions, { status: 200 })
}