import { taxDeductionInsights, TaxDeductionInsightsInput } from "@/ai/flows/tax-deduction-insights";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { income, expenses, country, deductionRate, expenseBreakdown, incomeBreakdown } = body as TaxDeductionInsightsInput;

    if (!income || !expenses || !country || !deductionRate) {
      return NextResponse.json({ error: "Missing income, expenses, country or deductionRate data" }, { status: 400 });
    }
      if (!expenseBreakdown || !incomeBreakdown) {
          return NextResponse.json({ error: "Missing income or expense breakdown data" }, { status: 400 });
      }

    const insights = await taxDeductionInsights({ income, expenses, expenseBreakdown, incomeBreakdown, country, deductionRate });
    return NextResponse.json(insights, { status: 200 });
  } catch (error) {
    console.error("Error generating tax insights:", error);
      // Properly construct the error response
      return NextResponse.json(
          { error: "Internal Server Error: " + (error instanceof Error ? error.message : String(error)) },
          { status: 500 }
      );
  }
}
