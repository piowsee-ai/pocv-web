"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown, X } from "lucide-react";
import { City, State } from "country-state-city";

import { Button } from "@/components/ui/button";
import {
  Command,
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
  const [searchQuery, setSearchQuery] = React.useState("");

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
    setSearchQuery("");
  };

  const handleSelectCustom = (customValue: string) => {
    const syntheticEvent = {
      target: {
        id,
        value: customValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const syntheticEvent = {
      target: {
        id,
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(syntheticEvent);
  };

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return locationOptions;
    const query = searchQuery.toLowerCase();
    return locationOptions.filter(
      (option) =>
        option.city.toLowerCase().includes(query) ||
        option.state.toLowerCase().includes(query)
    );
  }, [locationOptions, searchQuery]);

  // Check if search query matches any option exactly
  const hasExactMatch = filteredOptions.length > 0;

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
            "w-full justify-between bg-white font-normal hover:bg-neutral-50 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selectedLocation?.displayValue || value || placeholder}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {value && (
              <span
                onClick={handleClear}
                className="p-0.5 rounded hover:bg-neutral-300 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-neutral-500 hover:text-neutral-700" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari lokasi..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <ScrollArea className="h-72">
              {/* Show custom option if user typed something and no exact match or few results */}
              {searchQuery.trim() && (
                <CommandGroup>
                  <CommandItem
                    value={`custom-${searchQuery}`}
                    onSelect={() => handleSelectCustom(searchQuery)}
                    className="cursor-pointer"
                  >
                    <span className="flex-1">Gunakan lokasi: &quot;{searchQuery}&quot;</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === searchQuery ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
              )}
              {filteredOptions.length > 0 ? (
                <CommandGroup heading={searchQuery ? "Hasil Pencarian" : undefined}>
                  {filteredOptions.slice(0, 100).map((option, index) => (
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
              ) : (
                !searchQuery.trim() && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Ketik untuk mencari lokasi.
                  </div>
                )
              )}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

