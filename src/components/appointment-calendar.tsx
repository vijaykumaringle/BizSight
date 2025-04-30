import {Calendar as CalendarIcon} from 'lucide-react';
import React, {useState} from 'react';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function AppointmentCalendar({className}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={'outline'}
        className={cn(
          'w-[240px] pl-3 text-left font-normal',
          !date && 'text-muted-foreground',
          className
        )}
      >
        {date ? (
          date.toLocaleDateString()
        ) : (
          <span>Pick a date</span>
        )}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
      />
    </PopoverContent>
  </Popover>
  );
}





// import {Calendar as CalendarIcon} from 'lucide-react';
// import {format} from 'date-fns';
// import * as React from 'react';

// import {cn} from '@/lib/utils';
// import {Button} from '@/components/ui/button';
// import {Calendar} from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';

// interface Appointment {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
// }

// interface AppointmentCalendarProps {
//   appointments: Appointment[];
// }

// const AppointmentCalendar = ({appointments}: AppointmentCalendarProps) => {
//   const [date, setDate] = React.useState<Date>(new Date());

//   return (
//     <div className="space-y-4">
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant={'outline'}
//             className={cn(
//               'w-[240px] pl-3 text-left font-normal',
//               !date && 'text-muted-foreground'
//             )}
//           >
//             {date ? (
//               format(date, 'PPP')
//             ) : (
//               <span>Pick a date</span>
//             )}
//             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={setDate}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//       <div className="space-y-2">
//         <h3 className="text-lg font-semibold">Appointments</h3>
//         <ul>
//           {appointments
//             .filter(
//               (appointment) =>
//                 appointment.start.toDateString() === date.toDateString()
//             )
//             .map((appointment) => (
//               <li key={appointment.id}>
//                 {appointment.title} -{' '}
//                 {format(appointment.start, 'h:mm a')} -{' '}
//                 {format(appointment.end, 'h:mm a')}
//               </li>
//             ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AppointmentCalendar;

// import React, { useState } from 'react';
// import { Calendar as CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import { Calendar } from '@/components/ui/calendar';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';

// export function AppointmentCalendar() {
//   const [date, setDate] = useState<Date | undefined>(new Date());

//   return (
//     <div className="p-4">
//       {/* Date Picker */}
//       <div className="flex items-center space-x-2">
//         <CalendarIcon className="h-4 w-4 text-muted-foreground" />
//         <p className="text-sm font-medium leading-none">
//           {date ? format(date, 'PPP') : 'Select a date'}
//         </p>
//       </div>

//       {/* Calendar Component */}
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         className="rounded-md border mt-4"
//       />
//     </div>
//   );
// }
