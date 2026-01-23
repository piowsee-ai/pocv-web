"use client";

import { useState } from "react";
import { ChevronDown, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CollapsibleCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove: () => void;
  defaultExpanded?: boolean;
}

export function CollapsibleCard({
  id,
  title,
  children,
  onRemove,
  defaultExpanded = true,
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onRemove();
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden",
          isDragging && "z-50 opacity-90 shadow-lg relative"
        )}
      >
        {/* Header - clickable area */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-neutral-100">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-100 transition-colors"
            title="Drag untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Title - clickable to expand/collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 text-left text-sm font-semibold text-emerald-700 truncate hover:text-emerald-800 transition-colors cursor-pointer"
          >
            {title}
          </button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Expand/Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 flex items-center justify-center rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="p-5">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
