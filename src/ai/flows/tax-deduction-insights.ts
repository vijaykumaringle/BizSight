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
  country: z.string().describe('The country for which to generate tax insights.').default('INDIA')
});
export type TaxDeductionInsightsInput = z.infer<typeof TaxDeductionInsightsInputSchema>;

const TaxDeductionInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-driven suggestions for potential tax deductions.'),
  disclaimer: z.string().describe('Disclaimer about the provided insights.')
});

export type TaxDeductionInsightsOutput = z.infer<typeof TaxDeductionInsightsOutputSchema>;
export async function taxDeductionInsights(input: TaxDeductionInsightsInput): Promise<TaxDeductionInsightsOutput> {
  const { income, expenses } = input;
  // Calculate a rough estimate of tax deductions (this is a simplified example)
    const deductionRate = 0.2; // Example: 20% of expenses as potential deductions
    const estimatedDeductions = expenses * deductionRate;
  
    const insights = `Based on your income of ₹${income} and expenses of ₹${expenses}, you may have potential tax deductions of approximately ₹${estimatedDeductions.toFixed(2)} in India. These are some of the insights: You may be eligible for deductions under sections like 80C, 80D, and others, such as HRA and business expenses. Make sure you are updated with India's tax laws. Please verify with your accountant.`;
  
    const disclaimer = 'The tax insights provided are based on information related to India and are not financial advice. Consult with a qualified tax professional in India for personalized advice.';
  
    

    return { insights, disclaimer };

  }




const prompt = ai.definePrompt({
  name: 'taxDeductionInsightsPrompt',
  input: {
    schema: z.object({
      income: z.number().describe('Total income recorded.'),
      expenses: z.number().describe('Total expenses recorded.'),
      expenseBreakdown: z.string().describe('A detailed breakdown of the expenses.'),
      incomeBreakdown: z.string().describe('A detailed breakdown of the income sources.'),
    }),
  },
  output: {
    schema: z.object({
        insights: z.string().describe('AI-driven suggestions for potential tax deductions.'),
    }),
  },
  prompt: `You are an AI tax assistant providing insights on potential tax deductions for small business owners.

  Based on the following income and expense information, provide a detailed list of potential tax deductions the user could explore. Include specific suggestions and actions the user can take.

  Income: {{{income}}}
  Expenses: {{{expenses}}}
  Expense Breakdown: {{{expenseBreakdown}}}
  Income Breakdown: {{{incomeBreakdown}}}

  It is important to note that you are an AI and not a tax professional. Always recommend the user consult with a qualified professional.

  Return the output as a JSON object with "result" field.
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
