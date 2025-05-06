import React from 'react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    date: '2023-01-15',
    dueDate: '2023-01-30',
    customer: 'Acme Corp',
    amount: 1200.50,
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    date: '2023-02-20',
    dueDate: '2023-03-05',
    customer: 'Beta Industries',
    amount: 850.00,
    status: 'Unpaid',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    date: '2023-03-10',
    dueDate: '2023-03-25',
    customer: 'Gamma Ltd',
    amount: 2300.75,
    status: 'Overdue',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    date: '2023-04-05',
    dueDate: '2023-04-20',
    customer: 'Delta Co',
    amount: 540.20,
    status: 'Paid',
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    date: '2023-05-12',
    dueDate: '2023-05-27',
    customer: 'Epsilon Group',
    amount: 1500.00,
    status: 'Unpaid',
  },
];

const InvoiceList: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice List</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Invoice #</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Due Date</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyInvoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{invoice.invoiceNumber}</td>
              <td className="py-2 px-4 border-b">{invoice.date}</td>
              <td className="py-2 px-4 border-b">{invoice.dueDate}</td>
              <td className="py-2 px-4 border-b">{invoice.customer}</td>
              <td className="py-2 px-4 border-b">${invoice.amount.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'Unpaid'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {invoice.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;