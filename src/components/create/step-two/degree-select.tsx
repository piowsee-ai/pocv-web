"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEGREE_OPTIONS = [
  { value: "SD", label: "SD" },
  { value: "SMP", label: "SMP" },
  { value: "SMA/SMK", label: "SMA/SMK" },
  { value: "D1", label: "Diploma 1 (D1)" },
  { value: "D2", label: "Diploma 2 (D2)" },
  { value: "D3", label: "Diploma 3 (D3)" },
  { value: "D4", label: "Diploma 4 (D4)" },
  { value: "S1", label: "Sarjana (S1)" },
  { value: "S2", label: "Magister (S2)" },
  { value: "S3", label: "Doktor (S3)" },
];

interface DegreeSelectProps {
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function DegreeSelect({
  id = "degree",
  value,
  onChange,
  disabled,
  className,
}: DegreeSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedDegree = DEGREE_OPTIONS.find((d) => d.value === value);

  const handleSelect = (degreeValue: string) => {
    const syntheticEvent = {
      target: {
        id,
        value: degreeValue,
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
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-white font-normal hover:bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedDegree?.label || "Pilih Gelar"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Cari gelar..." />
          <CommandList>
            <CommandEmpty>Gelar tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {DEGREE_OPTIONS.map((degree) => (
                <CommandItem
                  key={degree.value}
                  value={degree.label}
                  onSelect={() => handleSelect(degree.value)}
                  className="cursor-pointer"
                >
                  <span className="flex-1">{degree.label}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === degree.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
