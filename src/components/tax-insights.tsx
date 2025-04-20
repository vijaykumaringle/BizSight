"use client";

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Assuming the flow is exposed at this endpoint by Genkit
const TAX_INSIGHTS_API_ENDPOINT = '/api/genkit/flows/taxDeductionInsights';

export function TaxInsights() {
  const [isPending, startTransition] = useTransition();
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = () => {
    startTransition(async () => {
      setError(null);
      setInsights(null); // Clear previous insights

      try {
        // TODO: Replace with actual income and expense data
        // This data should likely be fetched from your application state or another API
        const requestData = {
          input: {
            income: 50000, // Placeholder
            expenses: 15000, // Placeholder
            expenseBreakdown: "Office supplies: $500, Travel: $1000, Software: $200", // Placeholder
            incomeBreakdown: "Client A: $30000, Client B: $20000", // Placeholder
          }
        };

        const response = await fetch(TAX_INSIGHTS_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Assuming the flow returns an object with an 'insights' property
        // Adjust based on the actual structure of TaxDeductionInsightsOutput
        if (result && result.output && typeof result.output.insights === 'string') {
           setInsights(result.output.insights);
        } else {
          // Attempt to stringify if it's not in the expected format, or show raw
          setInsights(JSON.stringify(result.output, null, 2) || 'No specific insights found in response.');
        }

      } catch (err) {
        console.error("Error generating tax insights:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setInsights(null);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Deduction Insights</CardTitle>
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
        {insights && !isPending && (
          <div className="prose prose-sm max-w-none">
            {/* Render insights - adjust formatting as needed */}
            <pre className="whitespace-pre-wrap text-sm">{insights}</pre>
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
