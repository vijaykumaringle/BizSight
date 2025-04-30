"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Assuming the flow is exposed at this endpoint by Genkit
const TAX_INSIGHTS_API_ENDPOINT = '/tax-insights';

import * as Icons from "@/components/icons"

interface TaxInsightsProps {
    income: number;
    expenses: number;
    currency: string;
    expenseBreakdown: string;
    incomeBreakdown: string;
    country:string;
    conversionRate:number;
    deductionRate?:number;

}

export function TaxInsights({ income, expenses, currency, expenseBreakdown, incomeBreakdown, country, conversionRate }: TaxInsightsProps) {

    const [insights, setInsights] = useState<string | null>(null);
    const [disclaimer, setDisclaimer] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [localIncome, setLocalIncome] = useState<number>(income);
  const [localExpenses, setLocalExpenses] = useState<number>(expenses);

  useEffect(() => {
    setLocalIncome(income);
    setLocalExpenses(expenses);
  }, [income, expenses]);

  const effectiveDeductionRate = 0.2

  const handleGenerateInsights = () => {
      startTransition(async () => {
      setError(null); // Clear previous error
      setInsights(null); // Clear previous insights
      setDisclaimer(null); // Clear previous disclaimer

      try {
          // Simulate fetching income and expense data from your application's state or another API
        // In a real application, you would fetch this from your data layer
        let finalIncome = localIncome;
        let finalExpenses = localExpenses;

          if (currency === "INR") {
            // Assuming a conversion rate of 80 INR to 1 USD for demonstration
            finalIncome = localIncome / conversionRate;
            finalExpenses = localExpenses / conversionRate;
          }

        const requestData = {          
          income: finalIncome,
          expenses: finalExpenses,
          currency: currency, // Added currency to request
          expenseBreakdown: expenseBreakdown, // Example breakdown, can be dynamic
          incomeBreakdown: incomeBreakdown, // Example breakdown, can be dynamic
          country: country || 'India', // Default to India if not provided
          deductionRate: effectiveDeductionRate
        };

        const response = await fetch(TAX_INSIGHTS_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          // Check content type before assuming JSON
          const contentType = response.headers.get('content-type');
          let errorMessage = `HTTP error! status: ${response.status}`;
           try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
             const errorText = await response.text();
             errorMessage = `${errorMessage}: ${errorText}`;
            console.error("Raw error response from server:", errorText)
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data && data.insights && data.disclaimer) {
            setInsights(data.insights || null);
            setDisclaimer(data.disclaimer || null)
        }
        else {
            throw new Error("The API returned an invalid data structure.");
        }
      } catch (err) {
        console.error("Error generating tax insights:", err);
        const error = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(error);
        setInsights(null);
        setDisclaimer(null);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>Generate AI-powered insights based on your income and expenses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[220px]" />
            </div>
        )}
        {error && (
          <p className="text-sm text-red-600">Error: {error}</p>
        )}
        {insights !== null && !isPending && (
          <div className="space-y-2">
                <pre className="whitespace-pre-wrap text-sm">{insights.replace(/\$(\d[\d,]*)/g, (match, number) => "₹" + Number(number.replace(/,/g, '')).toLocaleString('en-IN'))}</pre>
            
                {disclaimer && (
              <p className="text-sm italic">{disclaimer}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={isPending}>
          {isPending ? 'Generating...' : 'Generate Tax Insights'}
        </Button>
      </CardFooter>
    </Card>
  );
}
