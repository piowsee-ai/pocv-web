"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { City, State } from "country-state-city";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LocationOption {
  city: string;
  state: string;
  displayValue: string;
}

interface LocationInputProps {
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function LocationInput({
  id = "location",
  value,
  onChange,
  disabled,
  className,
  placeholder = "Pilih lokasi",
}: LocationInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Get all Indonesian cities and states
  const locationOptions = React.useMemo(() => {
    const indonesianStates = State.getStatesOfCountry("ID");
    const options: LocationOption[] = [];

    indonesianStates.forEach((state) => {
      const cities = City.getCitiesOfState("ID", state.isoCode);
      cities.forEach((city) => {
        options.push({
          city: city.name,
          state: state.name,
          displayValue: `${city.name}, ${state.name}, Indonesia`,
        });
      });
    });

    return options;
  }, []);

  const selectedLocation = locationOptions.find(
    (location) => location.displayValue === value,
  );

  const handleSelect = (option: LocationOption) => {
    const syntheticEvent = {
      target: {
        id,
        value: option.displayValue,
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
            className,
          )}
        >
          <span className="truncate">
            {selectedLocation?.displayValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Cari lokasi..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {locationOptions.map((option, index) => (
                  <CommandItem
                    key={index}
                    value={option.displayValue}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    <span className="flex-1">{option.city}</span>
                    <span className="text-sm text-muted-foreground mr-2">
                      {option.state}
                    </span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.displayValue
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

