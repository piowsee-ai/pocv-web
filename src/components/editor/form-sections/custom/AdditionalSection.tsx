"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, GripVertical, Trash2, ChevronDown, Pencil, Info } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FormSectionProps } from "../common/types";
import { getDescriptionHtml, updateDescription } from "../common/helpers";
import { CustomSection, CustomSectionItem, FormData } from "@/types/editor-form-data";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import { MAX_LENGTH, truncateToMaxLength } from "@/lib/validation/editor-validation";

// Custom Section - Tips
const CUSTOM_SECTION_TIPS = [
  "Tambahkan section kustom sesuai kebutuhan",
  "Setiap section bisa memiliki beberapa item",
  "Semua field bersifat opsional kecuali nama",
  "Cocok untuk: Skills, Bahasa, Sertifikasi, dll",
];

// Helper to get custom section item header
function getCustomItemHeader(item: CustomSectionItem): string {
  if (item.title) return item.title;
  return "(Belum diisi)";
}

// Custom Section Item Card (inside a custom section)
function CustomSectionItemCard({
  item,
  index,
  onUpdate,
  onUpdateMultiple,
  onRemove,
  sectionIndex,
  data,
  setData,
}: {
  item: CustomSectionItem;
  index: number;
  onUpdate: (field: string, value: string | string[] | boolean) => void;
  onUpdateMultiple: (updates: Partial<CustomSectionItem>) => void;
  onRemove: () => void;
  sectionIndex: number;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id || `item-${index}` });

  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          "bg-white border border-neutral-200 rounded-lg overflow-hidden",
          isDragging && "z-50 opacity-90 shadow-lg relative"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-100 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-neutral-400" />
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 text-left cursor-pointer min-w-0"
          >
            <span className="text-sm font-semibold text-emerald-700 truncate block max-w-full hover:text-emerald-800">
              {getCustomItemHeader(item)}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="p-1.5 rounded text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} />
          </button>
        </div>

        {/* Content */}
        <div className={cn(
          "grid transition-all duration-200",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}>
          <div className="overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama / Judul</Label>
                  <Input
                    value={item.title || ""}
                    onChange={(e) => onUpdate("title", truncateToMaxLength(e.target.value, MAX_LENGTH.TITLE))}
                    placeholder="Nama kegiatan, skill, dll"
                    maxLength={MAX_LENGTH.TITLE}
                    className="text-neutral-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sub Judul</Label>
                  <Input
                    value={item.subtitle || ""}
                    onChange={(e) => onUpdate("subtitle", truncateToMaxLength(e.target.value, MAX_LENGTH.TITLE))}
                    placeholder="Posisi, peran, dll"
                    maxLength={MAX_LENGTH.TITLE}
                    className="text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <MonthPickerInput
                    value={item.startDate || ""}
                    onChange={(e) => onUpdate("startDate", e.target.value)}
                    placeholder="Pilih bulan"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tanggal Selesai</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`custom-${sectionIndex}-${index}-current`}
                        checked={item.isCurrent || false}
                        onCheckedChange={(checked) => onUpdate("isCurrent", checked === true)}
                        disabled={!item.startDate}
                      />
                      <label htmlFor={`custom-${sectionIndex}-${index}-current`} className={`text-xs cursor-pointer ${!item.startDate ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Saat Ini
                      </label>
                    </div>
                  </div>
                  <MonthPickerInput
                    value={item.endDate || ""}
                    onChange={(e) => onUpdate("endDate", e.target.value)}
                    placeholder={!item.startDate ? "Isi tanggal mulai dulu" : "Pilih bulan"}
                    disabled={item.isCurrent || !item.startDate}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <RichTextEditor
                  value={getDescriptionHtml(item)}
                  onChange={(value: string) => {
                    onUpdateMultiple(updateDescription(value));
                  }}
                  placeholder="Deskripsi detail..."
                  maxLength={MAX_LENGTH.DESCRIPTION}
                />
              </div>
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
              Apakah Anda yakin ingin menghapus item ini?
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

// Draggable Custom Section Card
function CustomSectionCard({
  section,
  sectionIndex,
  data,
  setData,
}: {
  section: CustomSection;
  sectionIndex: number;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.sectionKey });

  const [isExpanded, setIsExpanded] = useState(sectionIndex === 0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section.sectionTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateSection = (updates: Partial<CustomSection>) => {
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((s, i) =>
        i === sectionIndex ? { ...s, ...updates } : s
      ),
    }));
  };

  const updateItem = (itemIndex: number, field: string, value: string | string[] | boolean) => {
    const updatedItems = [...section.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };

    // If "Saat Ini" is checked, clear endDate
    if (field === "isCurrent" && value === true) {
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], endDate: "" };
    }

    // If startDate is cleared, also clear endDate and isCurrent
    if (field === "startDate" && !value) {
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], endDate: "", isCurrent: false };
    }

    updateSection({ items: updatedItems });
  };

  // Update multiple fields at once (for description updates)
  const updateItemMultiple = (itemIndex: number, updates: Partial<CustomSectionItem>) => {
    const updatedItems = [...section.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };
    updateSection({ items: updatedItems });
  };

  const addItem = () => {
    updateSection({
      items: [
        ...section.items,
        {
          id: `item-${Date.now()}`,
          title: "",
          subtitle: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [],
          descriptionHtml: "",
        },
      ],
    });
  };

  const removeItem = (itemIndex: number) => {
    updateSection({
      items: section.items.filter((_, i) => i !== itemIndex),
    });
  };

  const removeSection = () => {
    setShowDeleteDialog(false);
    setData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== sectionIndex),
    }));
  };

  const handleTitleSave = () => {
    updateSection({ sectionTitle: editedTitle.trim() || "Untitled" });
    setIsEditingTitle(false);
  };

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => (item.id || `item-${section.items.indexOf(item)}`) === active.id);
      const newIndex = section.items.findIndex((item) => (item.id || `item-${section.items.indexOf(item)}`) === over.id);
      updateSection({ items: arrayMove(section.items, oldIndex, newIndex) });
    }
  };

  // Ensure all items have IDs
  const itemsWithIds = section.items.map((item, idx) => ({
    ...item,
    id: item.id || `item-${idx}`,
  }));

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
        {/* Section Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-neutral-100">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-100 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-neutral-400" />
          </div>

          {isEditingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                ref={titleInputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => {
                  const truncated = truncateToMaxLength(e.target.value, MAX_LENGTH.SECTION_TITLE);
                  setEditedTitle(truncated);
                }}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setEditedTitle(section.sectionTitle);
                    setIsEditingTitle(false);
                  }
                }}
                maxLength={MAX_LENGTH.SECTION_TITLE}
                className="flex-1 text-sm font-semibold text-emerald-700 bg-transparent border-b-2 border-emerald-500 outline-none"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 text-left cursor-pointer min-w-0"
            >
              <span className="text-sm font-semibold text-emerald-700 truncate block max-w-full hover:text-emerald-800">
                {section.sectionTitle || "Untitled"}
              </span>
            </button>
          )}

          {!isEditingTitle && (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              title="Edit nama section"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="p-1.5 rounded text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} />
          </button>
        </div>

        {/* Section Content */}
        <div className={cn(
          "grid transition-all duration-200",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}>
          <div className="overflow-hidden">
            <div className="p-4 space-y-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleItemDragEnd}
              >
                <SortableContext
                  items={itemsWithIds.map((item) => item.id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {itemsWithIds.map((item, itemIndex) => (
                      <CustomSectionItemCard
                        key={item.id}
                        item={item}
                        index={itemIndex}
                        sectionIndex={sectionIndex}
                        data={data}
                        setData={setData}
                        onUpdate={(field, value) => updateItem(itemIndex, field, value)}
                        onUpdateMultiple={(updates) => updateItemMultiple(itemIndex, updates)}
                        onRemove={() => removeItem(itemIndex)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Section Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Section</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus section "{section.sectionTitle || 'Untitled'}" beserta semua itemnya?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={removeSection}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Additional/Custom Section
export function AdditionalSection({ data, setData }: FormSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = () => {
    setData((prev) => ({
      ...prev,
      customSections: [
        ...(prev.customSections || []),
        {
          sectionKey: `section-${Date.now()}`,
          sectionTitle: "Untitled",
          sectionType: "itemList" as const,
          text: "",
          items: [],
        },
      ],
    }));
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const sections = data.customSections || [];
      const oldIndex = sections.findIndex((s) => s.sectionKey === active.id);
      const newIndex = sections.findIndex((s) => s.sectionKey === over.id);
      setData((prev) => ({
        ...prev,
        customSections: arrayMove(prev.customSections || [], oldIndex, newIndex),
      }));
    }
  };

  const sectionsWithKeys = (data.customSections || []).map((section, idx) => ({
    ...section,
    sectionKey: section.sectionKey || `section-${idx}`,
  }));

  return (
    <div className="space-y-6">
      {/* Static header - not editable */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-900">Custom Section</h2>
        {CUSTOM_SECTION_TIPS.length > 0 && (
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors"
                  title="Tips"
                >
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-sm p-3">
                <ul className="space-y-1.5 text-sm">
                  {CUSTOM_SECTION_TIPS.map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-emerald-500 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={sectionsWithKeys.map((s) => s.sectionKey)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sectionsWithKeys.map((section, index) => (
              <CustomSectionCard
                key={section.sectionKey}
                section={section}
                sectionIndex={index}
                data={data}
                setData={setData}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Section Button */}
      <Button
        variant="outline"
        onClick={addSection}
        className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2"
      >
        <Plus className="w-4 h-4" />
        Tambah Section
      </Button>
    </div>
  );
}
