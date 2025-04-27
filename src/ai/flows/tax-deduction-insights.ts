'use server';

/**
 * @fileOverview Provides AI-driven tax deduction insights based on user's income and expenses.
 *
 * - taxDeductionInsights - A function that generates tax deduction insights.
 * - TaxDeductionInsightsInput - The input type for the taxDeductionInsights function.
 * - TaxDeductionInsightsOutput - The return type for the taxDeductionInsights function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TaxDeductionInsightsInputSchema = z.object({
  income: z.number().describe('Total income recorded.'),
  expenses: z.number().describe('Total expenses recorded.'),
  expenseBreakdown: z.string().describe('A detailed breakdown of the expenses.'),
  incomeBreakdown: z.string().describe('A detailed breakdown of the income sources.'),
  deductionRate: z.number().describe('Rate of tax deduction to apply.'),
  country: z.string().describe('The country for which to generate tax insights.')
});
export type TaxDeductionInsightsInput = z.infer<typeof TaxDeductionInsightsInputSchema>;

const TaxDeductionInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-driven suggestions for potential tax deductions. '),
  disclaimer: z.string().describe('Disclaimer about the provided insights.')
});

export type TaxDeductionInsightsOutput = z.infer<typeof TaxDeductionInsightsOutputSchema>;
export async function taxDeductionInsights(input: TaxDeductionInsightsInput): Promise<TaxDeductionInsightsOutput> {
  return taxDeductionInsightsFlow(input);
}




const prompt = ai.definePrompt({
  name: 'taxDeductionInsightsPrompt',
  input: {
    schema: z.object({
      income: z.number().describe('Total income recorded.'),
      expenses: z.number().describe('Total expenses recorded.'),
      expenseBreakdown: z.string().describe('A detailed breakdown of the expenses.'),
      incomeBreakdown: z.string().describe('A detailed breakdown of the income sources.'),
      country: z.string().describe('The country for which to generate tax insights.'),
    }),
  },
  output: {
    schema: z.object({
        insights: z.string().describe('AI-driven suggestions for potential tax deductions.'),
        disclaimer: z.string().describe('Disclaimer about the provided insights.'),
    }),
  },
  prompt: `You are an AI tax assistant providing insights on potential tax deductions for small business owners in {{{country}}}.

  Based on the following income and expense information, provide a detailed list of potential tax deductions the user could explore. Include specific suggestions and actions the user can take. Mention relevant sections of the tax law, if possible.
  Also provide a disclaimer that these are only insights and the user should consult a tax professional.

  Income: {{{income}}}
  Expenses: {{{expenses}}}
  Expense Breakdown: {{{expenseBreakdown}}}
  Income Breakdown: {{{incomeBreakdown}}}
  Country: {{{country}}}

  It is important to note that you are an AI and not a tax professional. 

  Return the output as a JSON object with "insights" and "disclaimer" fields.
  `,
});

const taxDeductionInsightsFlow = ai.defineFlow<
  typeof TaxDeductionInsightsInputSchema,
  typeof TaxDeductionInsightsOutputSchema
>(
  {
    name: 'taxDeductionInsightsFlow',
    inputSchema: TaxDeductionInsightsInputSchema,
    outputSchema: TaxDeductionInsightsOutputSchema,
  },
  async input => {
    const output = await prompt(input);
    return output.output!;
  }
);
