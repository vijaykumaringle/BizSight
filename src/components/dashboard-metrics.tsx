import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardMetricsProps {
  revenue: number;
  expenses: number;
  profit: number;
  currency: string; // e.g., "USD", "INR"
}

export function DashboardMetrics({
  revenue,
  expenses,
  profit,
  currency,
}: DashboardMetricsProps) {
  const effectiveCurrency = currency || 'USD'
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { // 'en-US' can be changed for different locale formatting if needed
      style: 'currency',
      currency: effectiveCurrency,
    }).format(value);
    
    
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>{formatCurrency(revenue)}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>{formatCurrency(expenses)}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profit</CardTitle>
        </CardHeader>
        <CardContent>{formatCurrency(profit)}</CardContent>
      </Card>
    </div>
  );
}

