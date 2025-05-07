import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useUserCurrency } from "@/hooks/use-user-currency";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  date: z.string().refine((dateString) => {
    return !isNaN(Date.parse(dateString));
  }, {
    message: "Invalid date format."
  }),
  amount: z.string({ required_error: "Amount is required.", })
    .transform((val) => parseFloat(val)) // Use parseFloat for potentially decimal amounts
    .refine((amount) => amount >= 0, { message: "Amount must be a non-negative number" }),
  description: z.string().min(1, {
    message: "Description must be at least 1 character.",
  }),
  category: z.string().min(1, { message: "Category must be at least 1 character.", }),
  currency: z.string().min(2, { message: "Currency is required."}), // Added currency to schema
});

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const { currency: userCurrency } = useUserCurrency(); // Destructure currency from the hook's return object
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today,
      amount: "0",
      description: "",
      category: "",
      currency: userCurrency || "USD", // Initialize with user's currency or default
    },
  });
  
  // Update default currency if userCurrency changes after initial load
  useState(() => {
    form.reset({ ...form.getValues(), currency: userCurrency || "USD" });
  }, [userCurrency, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values), // Values already include currency
        });
  
        if (response.ok) {
        form.reset({ // Reset with current date and currency, clear other fields
          date: today,
          amount: "0",
          description: "",
          category: "",
          currency: userCurrency || "USD",
        });
        onExpenseAdded();
        toast({ description: "Expense added successfully." });
      } else {
        const errorData = await response.json();
        toast({ variant: "destructive", description: `Failed to add expense: ${errorData.error || response.statusText}` });
        console.error("Failed to add expense transaction", errorData);
      }
    } catch (error) {
      toast({ variant: "destructive", description: "An error occurred while adding the expense." });
      console.error("Error adding expense transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1"> {/* Adjusted spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Layout for better responsiveness */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    placeholder="Date" 
                    {...field} // Spread field props
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" // Allow decimals
                    placeholder="Amount" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || userCurrency}> {/* Ensure value is controlled */}
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                  <SelectItem value="MXN">MXN ($)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Office lunch, Software subscription" 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Software & Tools">Software & Tools</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Professional Services">Professional Services</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto"> {/* Responsive button width */}
          {isSubmitting ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    </Form>
  );
}
