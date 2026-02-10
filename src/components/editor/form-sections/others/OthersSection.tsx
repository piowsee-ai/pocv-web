"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, GripVertical, Trash2, ChevronDown } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

import { FormSectionProps } from "../common/types";
import { OthersItem } from "@/types/editor-form-data";
import { cn } from "@/lib/utils";
import { MAX_LENGTH } from "@/lib/validation/editor-validation";
import { useValidationToast } from "@/components/ui/validation-toast";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { EditableSectionHeader } from "../../ui/editable-section-header";

// Tips for the Others section
const OTHERS_SECTION_TIPS = [
    "Tambahkan skills, bahasa, sertifikasi, atau apapun",
    "Setiap item memiliki judul bebas dan deskripsi",
    "Deskripsi bisa berupa daftar atau paragraf",
    "Drag & drop untuk mengatur urutan",
    "Tidak ada batasan jumlah item",
];

// Individual item card component
function OthersItemCard({
    item,
    onUpdateTitle,
    onUpdateDescription,
    onRemove,
    isFirst,
}: {
    item: OthersItem;
    onUpdateTitle: (title: string) => void;
    onUpdateDescription: (html: string) => void;
    onRemove: () => void;
    isFirst: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(isFirst);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { showValidationError } = useValidationToast();

    // Internal state for title to avoid cursor jumping during validation/updates
    const [titleValue, setTitleValue] = useState(item.title);

    useEffect(() => {
        if (item.title !== titleValue) setTitleValue(item.title);
    }, [item.title]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = () => {
        setShowDeleteDialog(false);
        onRemove();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitleValue(val);
        onUpdateTitle(val);
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
                        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-100 transition-colors shrink-0"
                    >
                        <GripVertical className="w-4 h-4 text-neutral-400" />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-1 text-left cursor-pointer min-w-0"
                    >
                        <span className={cn(
                            "text-sm font-semibold truncate block max-w-full",
                            "text-emerald-700 hover:text-emerald-800"
                        )}>
                            {item.title || "(Tanpa Judul)"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                        }}
                        className="p-1.5 rounded text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer shrink-0"
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
                            <div className="space-y-4">
                                {/* Title Input */}
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${item.id}`}>Judul Item</Label>
                                    <Input
                                        id={`title-${item.id}`}
                                        value={titleValue}
                                        onChange={handleTitleChange}
                                        placeholder="Contoh: Skills, Bahasa, Sertifikat"
                                        maxLength={MAX_LENGTH.SECTION_TITLE}
                                    />
                                    <div className="text-right text-xs text-neutral-400">
                                        {titleValue.length}/{MAX_LENGTH.SECTION_TITLE}
                                    </div>
                                </div>

                                {/* Description Editor */}
                                <div className="space-y-2">
                                    <Label>Deskripsi</Label>
                                    <RichTextEditor
                                        value={item.descriptionHtml}
                                        onChange={onUpdateDescription}
                                        placeholder="JavaScript, TypeScript, React, Node.js..."
                                        maxLength={MAX_LENGTH.DESCRIPTION}
                                        showListButtons={false}
                                        minHeight={120}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Item?</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menghapus &quot;{item.title || "item ini"}&quot;? Tindakan ini tidak dapat dibatalkan.
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

// Main section component
export function OthersSection({ data, setData }: FormSectionProps) {
    const [items, setItems] = useState<OthersItem[]>([]);
    const initializedRef = useRef(false);
    const prevItemsRef = useRef<string>("");

    // Load items from data.othersItems on initial load or when data changes externally
    useEffect(() => {
        const othersItems = data.othersItems || [];
        const itemsStr = JSON.stringify(othersItems);

        // Skip if already initialized and data hasn't changed
        if (initializedRef.current && itemsStr === prevItemsRef.current) {
            return;
        }

        // If no othersItems, try to load from data.additional (legacy/initial load from LLM)
        if (othersItems.length === 0 && !initializedRef.current) {
            const additional = data.additional;
            if (additional) {
                const loadedItems: OthersItem[] = [];
                const keys: (keyof typeof additional)[] = ["skills", "languages", "certifications", "achievements"];

                keys.forEach((key) => {
                    const arr = additional[key];
                    if (arr && arr.length > 0 && arr.some((s: string) => s.trim())) {
                        const content = arr.filter((s: string) => s.trim()).join(", ");
                        loadedItems.push({
                            id: `others-${key}-${Date.now()}`,
                            title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
                            descriptionHtml: `<p>${content}</p>`,
                        });
                    }
                });

                if (loadedItems.length > 0) {
                    setItems(loadedItems);
                    prevItemsRef.current = JSON.stringify(loadedItems);
                    initializedRef.current = true;
                    // Also sync to data.othersItems immediately for initial conversion
                    setData((prev) => ({
                        ...prev,
                        othersItems: loadedItems,
                    }));
                    return;
                }
            }
        }

        setItems(othersItems);
        prevItemsRef.current = itemsStr;
        initializedRef.current = true;
    }, [data.othersItems, data.additional, setData]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update section title
    const updateSectionTitle = (title: string) => {
        setData((prev) => ({
            ...prev,
            sectionTitles: { ...prev.sectionTitles, others: title },
        }));
    };

    // Sync items back to data.othersItems
    const syncToData = useCallback((newItems: OthersItem[]) => {
        // Update ref to prevent re-sync loop
        prevItemsRef.current = JSON.stringify(newItems);

        setData((prev) => ({
            ...prev,
            othersItems: newItems,
        }));
    }, [setData]);



    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            syncToData(newItems);
        }
    };

    const handleUpdateTitle = (index: number, title: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], title };
        setItems(newItems);
        syncToData(newItems);
    };

    const handleUpdateDescription = (index: number, html: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], descriptionHtml: html };
        setItems(newItems);
        syncToData(newItems);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        syncToData(newItems);
    };

    const handleAddItem = () => {
        // Create new item with empty title (user will fill it)
        const newItem: OthersItem = {
            id: `others-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: "", // Empty title - user defines it
            descriptionHtml: "",
        };

        const newItems = [...items, newItem];
        setItems(newItems);
        syncToData(newItems);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <EditableSectionHeader
                title={data.sectionTitles?.others || "Skills, Achievements & Other Experience"}
                defaultTitle="Skills, Achievements & Other Experience"
                onTitleChange={updateSectionTitle}
                tips={OTHERS_SECTION_TIPS}
            />

            {/* Items List */}
            {items.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <OthersItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdateTitle={(title) => handleUpdateTitle(index, title)}
                                    onUpdateDescription={(html) => handleUpdateDescription(index, html)}
                                    onRemove={() => handleRemoveItem(index)}
                                    isFirst={index === 0}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Add Button - Always available, no limit */}
            <Button
                type="button"
                variant="outline"
                onClick={handleAddItem}
                className="w-full border-dashed border-2 text-neutral-600 hover:text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50/50"
            >
                <Plus className="w-4 h-4 mr-2" />
                Tambahkan Item
            </Button>
        </div>
    );
}
