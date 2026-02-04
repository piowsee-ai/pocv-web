"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { LocationInput } from "@/components/ui/location-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { EditableSectionHeader } from "../../ui/editable-section-header";
import { CollapsibleCard } from "../../ui/collapsible-card";
import type { FormSectionProps } from "../common/types";
import type { WorkExperience } from "@/types/editor-form-data";
import { getDescriptionHtml, updateDescription } from "../common/helpers";
import { MAX_LENGTH, truncateToMaxLength } from "@/lib/validation/editor-validation";

// Helper to generate dynamic card header for work experience
function getWorkHeader(work: WorkExperience): string {
  if (work.company && work.position) return `${work.company} - ${work.position}`;
  if (work.company) return work.company;
  if (work.position) return work.position;
  return "Pengalaman Baru";
}

// Work Experience Section - Tips
const WORK_TIPS = [
  "Gunakan format: Aksi + Hasil + Angka. Contoh: 'Meningkatkan performa website sebesar 40%'",
  "Urutkan dari pekerjaan terbaru ke yang lama",
  "Fokus pada pencapaian, bukan hanya tugas rutin",
  "Drag untuk mengubah urutan",
];

// Work Experience Section
export function WorkExperienceSection({ data, setData }: FormSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateSectionTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      sectionTitles: { ...prev.sectionTitles, workExperience: title },
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: string | string[] | boolean) => {
    const updated = [...data.workExperiences];

    // Apply maxLength truncation for string fields
    let processedValue = value;
    if (typeof value === "string") {
      switch (field) {
        case "position":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.POSITION);
          break;
        case "company":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.COMPANY);
          break;
        case "location":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.LOCATION);
          break;
      }
    }

    updated[index] = { ...updated[index], [field]: processedValue };

    // If "Saat Ini" is checked, clear endDate
    if (field === "isCurrent" && value === true) {
      updated[index] = { ...updated[index], endDate: "" };
    }

    // If startDate is cleared, also clear endDate and isCurrent
    if (field === "startDate" && !value) {
      updated[index] = { ...updated[index], endDate: "", isCurrent: false };
    }

    setData((prev) => ({ ...prev, workExperiences: updated }));
  };

  const addWorkExperience = () => {
    setData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          id: `work-${Date.now()}`,
          position: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [],
        },
      ],
    }));
  };

  const removeWorkExperience = (index: number) => {
    setData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.workExperiences.findIndex((e) => (e.id || `work-${data.workExperiences.indexOf(e)}`) === active.id);
      const newIndex = data.workExperiences.findIndex((e) => (e.id || `work-${data.workExperiences.indexOf(e)}`) === over.id);
      setData((prev) => ({
        ...prev,
        workExperiences: arrayMove(prev.workExperiences, oldIndex, newIndex),
      }));
    }
  };

  // Ensure all items have IDs
  const workWithIds = data.workExperiences.map((work, idx) => ({
    ...work,
    id: work.id || `work-${idx}`,
  }));

  return (
    <div className="space-y-6">
      <EditableSectionHeader
        title={data.sectionTitles?.workExperience || "Work Experience"}
        defaultTitle="Work Experience"
        onTitleChange={updateSectionTitle}
        tips={WORK_TIPS}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workWithIds.map((e) => e.id!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {workWithIds.map((work, index) => (
              <CollapsibleCard
                key={work.id}
                id={work.id!}
                title={getWorkHeader(work)}
                onRemove={() => removeWorkExperience(index)}
                defaultExpanded={index === 0}
              >
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Posisi</Label>
                    <Input
                      value={work.position}
                      onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                      placeholder="Software Engineer"
                      maxLength={MAX_LENGTH.POSITION}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Perusahaan</Label>
                    <Input
                      value={work.company}
                      onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                      placeholder="PT Teknologi Indonesia"
                      maxLength={MAX_LENGTH.COMPANY}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lokasi</Label>
                    <LocationInput
                      value={work.location}
                      onChange={(e) => updateWorkExperience(index, "location", e.target.value)}
                      placeholder="Pilih lokasi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <MonthPickerInput
                      value={work.startDate}
                      onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)}
                      placeholder="Pilih bulan"
                    />
                  </div>

                  <div className="space-y-2 @md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label>Tanggal Selesai</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`work-current-${index}`}
                          checked={work.isCurrent || false}
                          onCheckedChange={(checked) => updateWorkExperience(index, "isCurrent", checked === true)}
                          disabled={!work.startDate}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={`work-current-${index}`}
                          className={cn(
                            "text-xs cursor-pointer",
                            work.startDate ? "text-neutral-500" : "text-neutral-300 cursor-not-allowed"
                          )}
                          title={!work.startDate ? "Isi tanggal mulai terlebih dahulu" : undefined}
                        >
                          Saat Ini
                        </label>
                      </div>
                    </div>
                    <MonthPickerInput
                      value={work.endDate}
                      onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                      placeholder={!work.startDate ? "Isi tanggal mulai dulu" : "Pilih bulan"}
                      disabled={work.isCurrent || !work.startDate}
                    />
                  </div>

                  <div className="space-y-2 @md:col-span-2">
                    <Label>Deskripsi Pekerjaan</Label>
                    <RichTextEditor
                      value={getDescriptionHtml(work)}
                      onChange={(value: string) => {
                        const updated = [...data.workExperiences];
                        updated[index] = { ...updated[index], ...updateDescription(value) };
                        setData((prev) => ({ ...prev, workExperiences: updated }));
                      }}
                      placeholder="Contoh: Mengembangkan fitur A yang meningkatkan X..."
                      maxLength={MAX_LENGTH.DESCRIPTION}
                    />
                  </div>
                </div>
              </CollapsibleCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addWorkExperience} className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
        <Plus className="w-4 h-4 mr-2" />
        Tambah Pengalaman Kerja
      </Button>
    </div>
  );
}
