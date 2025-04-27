import { ExpenseTransaction } from "@/lib/data";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface ExpenseListProps {
  expenseTransactions: ExpenseTransaction[];
}

export function ExpenseList({ expenseTransactions }: ExpenseListProps) {
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
        {expenseTransactions.map((transaction) => (
          <TableRow key={transaction.id}>          
          {(() => {
              const parsedDate = new Date(transaction.date);
              return <TableCell>{parsedDate.toLocaleDateString()}</TableCell>;
            })()}
             <TableCell>{transaction.amount}</TableCell>
             <TableCell>{transaction.description}</TableCell>
             <TableCell>{transaction.category}</TableCell>
           </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}