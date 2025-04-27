"use client";

import React, { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Assuming the flow is exposed at this endpoint by Genkit
const TAX_INSIGHTS_API_ENDPOINT = '/tax-insights';

import * as Icons from "@/components/icons"

export function TaxInsights() {
  const [insights, setInsights] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerateInsights = () => {
    startTransition(async () => {
      setError(null); // Clear previous error
      setInsights(null); // Clear previous insights
      setDisclaimer(null); // Clear previous disclaimer

      try {
          // Simulate fetching income and expense data from your application's state or another API
        // In a real application, you would fetch this from your data layer
        const country = "India";
        const requestData = {
          income: 50000.00,
          expenses: 15000.00,
          expenseBreakdown: "Office supplies: ₹500, Travel: ₹1000, Software: ₹200",
          incomeBreakdown: "Client A: ₹30000, Client B: ₹20000",
          country: country,
          
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
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            // If not JSON, read as text to get potentially helpful server error messages
            const errorText = await response.text();
            errorMessage = `${errorMessage}: ${errorText}`;
            console.error("Raw error response from server:", errorText)
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data && data.insights && data.disclaimer) {
            setInsights(data.insights);
            setDisclaimer(data.disclaimer)
        }
        else {
            throw new Error("The API returned an invalid data structure.");
        }
      } catch (err) {
        console.error("Error generating tax insights:", err);
        const error = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(error);
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
