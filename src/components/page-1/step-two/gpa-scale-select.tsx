"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const GPA_SCALE_OPTIONS = [
  { value: "4.0", label: "/ 4.0" },
  { value: "5.0", label: "/ 5.0" },
  { value: "100", label: "/ 100" },
];

interface GpaScaleSelectProps {
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function GpaScaleSelect({
  id = "gpaScale",
  value,
  onChange,
  disabled,
  className,
}: GpaScaleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedScale = GPA_SCALE_OPTIONS.find((s) => s.value === value);

  const handleSelect = (scaleValue: string) => {
    const syntheticEvent = {
      target: {
        id,
        value: scaleValue,
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
            "w-full justify-between bg-neutral-200 font-normal hover:bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedScale?.label || "Pilih Skala"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Skala tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {GPA_SCALE_OPTIONS.map((scale) => (
                <CommandItem
                  key={scale.value}
                  value={scale.label}
                  onSelect={() => handleSelect(scale.value)}
                  className="cursor-pointer"
                >
                  <span className="flex-1">{scale.label}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === scale.value ? "opacity-100" : "opacity-0"
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
