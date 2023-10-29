import { useEffect, useState } from "react";
import { IconCalendar as CalendarIcon } from "@tabler/icons-react";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DueDateInput = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [date, setDate] = useState<Date | undefined>(
    value && !isNaN(new Date(value).getTime()) ? new Date(value) : undefined
  );

  // Use useEffect to watch for changes in the date state and call onChange
  useEffect(() => {
    if (date) {
      // Format the selected date in the desired format, e.g., "yyyy-MM-dd"
      const formattedDate = format(date, "yyyy-MM-dd");
      // Call the onChange function with the formatted date
      onChange(formattedDate);
    }
  }, [date, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0"
        // side="right"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DueDateInput;
