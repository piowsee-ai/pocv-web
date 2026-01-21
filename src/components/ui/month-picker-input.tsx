"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthPicker } from "@/components/ui/monthpicker";
import { cn } from "@/lib/utils";

interface MonthPickerInputProps {
  id?: string;
  value?: string; // Format: "YYYY-MM"
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function MonthPickerInput({
  id,
  value,
  onChange,
  placeholder = "Pilih Bulan",
  disabled,
  className,
}: MonthPickerInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const [year, month] = value.split("-").map(Number);
    if (!isNaN(year) && !isNaN(month)) {
      return new Date(year, month - 1);
    }
    return undefined;
  }, [value]);

  const displayValue = React.useMemo(() => {
    if (!selectedDate) return "";
    return `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  const handleMonthSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const newValue = `${year}-${month}`;

    const syntheticEvent = {
      target: {
        id: id || "",
        value: newValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange?.(syntheticEvent);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-neutral-200 hover:bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <MonthPicker
          selectedMonth={selectedDate}
          onMonthSelect={handleMonthSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
