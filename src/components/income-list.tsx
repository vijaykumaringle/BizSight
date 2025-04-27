import { IncomeTransaction } from "@/lib/data";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface IncomeListProps {
  incomeTransactions: IncomeTransaction[];
}

export function IncomeList({ incomeTransactions }: IncomeListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incomeTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}