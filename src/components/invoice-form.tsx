import React, { useState } from 'react';

interface InvoiceFormData {
  invoiceNumber: string;
  clientName: string;
  date: string;
  dueDate: string;
  totalAmount: string;
}

const InvoiceForm: React.FC = () => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: '',
    clientName: '',
    date: '',
    dueDate: '',
    totalAmount: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Invoice Form Data:', formData);
    // Handle form submission logic here
    setFormData({
      invoiceNumber: '',
      clientName: '',
      date: '',
      dueDate: '',
      totalAmount: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
        <input
          type="text"
          name="invoiceNumber"
          id="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
        <input
          type="text"
          name="clientName"
          id="clientName"
          value={formData.clientName}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          name="dueDate"
          id="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          id="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit
      </button>
    </form>
  );
};

export default InvoiceForm;