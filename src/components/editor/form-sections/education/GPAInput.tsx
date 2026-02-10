"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { GpaScaleSelect } from "@/components/create/step-two/gpa-scale-select";

// GPA Input Component with scale selector
export function GPAInput({
  gpa,
  maxGpa,
  onGpaChange,
  onMaxGpaChange,
}: {
  gpa: string;
  maxGpa: string;
  onGpaChange: (value: string) => void;
  onMaxGpaChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={gpa}
          onChange={(e) => onGpaChange(e.target.value)}
          placeholder="3.75"
          className="text-center"
        />
      </div>
      <div className="flex-1">
        <GpaScaleSelect
          value={maxGpa}
          onChange={(e) => onMaxGpaChange(e.target.value)}
        />
      </div>
    </div>
  );
}
