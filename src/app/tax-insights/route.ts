import { taxDeductionInsights, TaxDeductionInsightsInput } from "@/ai/flows/tax-deduction-insights";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { income, expenses, country } = body as TaxDeductionInsightsInput;

    if (!income || !expenses || !country) {
      return NextResponse.json({ error: "Missing income, expenses, or country data" }, { status: 400 });
    }

    const insights = await taxDeductionInsights({ income, expenses, expenseBreakdown: body.expenseBreakdown, incomeBreakdown: body.incomeBreakdown, country });
    return NextResponse.json(insights, { status: 200 });
  } catch (error) {
    console.error("Error generating tax insights:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}