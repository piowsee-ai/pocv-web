"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MAX_LENGTH } from "@/lib/validation/editor-validation";
import { useValidationToast } from "@/components/ui/validation-toast";

interface EditableSectionHeaderProps {
  title: string;
  defaultTitle?: string;
  onTitleChange?: (newTitle: string) => void;
  tips?: string[];
}

export function EditableSectionHeader({
  title,
  defaultTitle,
  onTitleChange,
  tips,
}: EditableSectionHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showValidationError } = useValidationToast();

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedTitle.trim()) {
      onTitleChange?.(editedTitle.trim());
    } else {
      // Reset to default title if user empties the field
      const resetTitle = defaultTitle || title;
      setEditedTitle(resetTitle);
      onTitleChange?.(resetTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > MAX_LENGTH.SECTION_TITLE) {
      showValidationError(`Judul section maksimal ${MAX_LENGTH.SECTION_TITLE} karakter`);
      return;
    }
    setEditedTitle(value);
  };

  return (
    <div className="group flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              maxLength={MAX_LENGTH.SECTION_TITLE}
              className="text-xl font-bold text-neutral-900 bg-transparent border-b-2 border-emerald-500 outline-none px-0 py-1 flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={handleSave}
              className="p-1 rounded hover:bg-emerald-100 text-emerald-600 shrink-0"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 rounded hover:bg-red-100 text-red-500 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-neutral-900 truncate">{title}</h2>
            {onTitleChange && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-all shrink-0"
                title="Edit nama section"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {tips && tips.length > 0 && (
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors shrink-0"
                title="Tips"
              >
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-sm p-3">
              <ul className="space-y-1.5 text-sm">
                {tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-emerald-500 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

