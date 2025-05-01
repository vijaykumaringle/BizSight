
"use client"; // Add this directive

import { Calendar as CalendarIcon } from 'lucide-react';
import {format} from 'date-fns';
import React, { useState, useEffect } from 'react'; // Import useEffect

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function AppointmentCalendar({className}: React.HTMLAttributes<HTMLDivElement>) {
  // Initialize date state to undefined
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Set the date only on the client side after hydration
  useEffect(() => {
    setDate(new Date());
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal', // Use justify-start for alignment
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" /> {/* Move icon to the left */}
          {date ? (
            format(date, 'MM/dd/yyyy')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus // Keep initialFocus if desired, or remove if causing issues
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} // Example: disable past dates
        />
      </PopoverContent>
    </Popover>
  );
}
