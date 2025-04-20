import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          $50,000 {/* Placeholder value */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          $30,000 {/* Placeholder value */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profit</CardTitle>
        </CardHeader>
        <CardContent>
          $20,000 {/* Placeholder value */}
        </CardContent>
      </Card>
    </div>
  );
}
