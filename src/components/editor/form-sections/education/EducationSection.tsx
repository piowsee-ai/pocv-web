"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { LocationInput } from "@/components/ui/location-input";
import { DegreeSelect } from "@/components/create/step-two/degree-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
import type { Education } from "@/types/editor-form-data";
import { GPAInput } from "./GPAInput";
import { getDescriptionHtml, updateDescription } from "../common/helpers";
import { MAX_LENGTH, truncateToMaxLength } from "@/lib/validation/editor-validation";

// Helper to generate dynamic card header
function getEducationHeader(edu: Education): string {
  if (edu.institution && edu.degree) return `${edu.institution} - ${edu.degree}`;
  if (edu.institution) return edu.institution;
  return "Pendidikan Baru";
}

// Education Section - Tips
const EDUCATION_TIPS = [
  "Urutkan dari pendidikan terbaru ke yang lama",
  "Cantumkan IPK jika di atas 3.0. Jika tidak, lebih baik tidak dicantumkan",
  "Sertakan deskripsi pencapaian akademik yang relevan",
  "Drag untuk mengubah urutan",
];

// Education Section
export function EducationSection({ data, setData }: FormSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateSectionTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      sectionTitles: { ...prev.sectionTitles, education: title },
    }));
  };

  const updateEducation = (index: number, field: string, value: string | string[] | boolean) => {
    const updated = [...data.educations];

    // Apply maxLength truncation for string fields
    let processedValue = value;
    if (typeof value === "string") {
      switch (field) {
        case "institution":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.INSTITUTION);
          break;
        case "major":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.MAJOR);
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

    setData((prev) => ({ ...prev, educations: updated }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          id: `edu-${Date.now()}`,
          institution: "",
          degree: "",
          major: "",
          location: "",
          gpa: "",
          maxGpa: "4.0",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [],
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.educations.findIndex((e) => (e.id || `edu-${data.educations.indexOf(e)}`) === active.id);
      const newIndex = data.educations.findIndex((e) => (e.id || `edu-${data.educations.indexOf(e)}`) === over.id);
      setData((prev) => ({
        ...prev,
        educations: arrayMove(prev.educations, oldIndex, newIndex),
      }));
    }
  };

  // Ensure all items have IDs
  const educationsWithIds = data.educations.map((edu, idx) => ({
    ...edu,
    id: edu.id || `edu-${idx}`,
  }));

  return (
    <div className="space-y-6">
      <EditableSectionHeader
        title={data.sectionTitles?.education || "Education"}
        defaultTitle="Education"
        onTitleChange={updateSectionTitle}
        tips={EDUCATION_TIPS}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={educationsWithIds.map((e) => e.id!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {educationsWithIds.map((edu, index) => (
              <CollapsibleCard
                key={edu.id}
                id={edu.id!}
                title={getEducationHeader(edu)}
                onRemove={() => removeEducation(index)}
                defaultExpanded={index === 0}
              >
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2 @md:col-span-2">
                    <Label>Nama Institusi</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      placeholder="Universitas Indonesia"
                      maxLength={MAX_LENGTH.INSTITUTION}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gelar</Label>
                    <DegreeSelect
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jurusan</Label>
                    <Input
                      value={edu.major}
                      onChange={(e) => updateEducation(index, "major", e.target.value)}
                      placeholder="Teknik Informatika"
                      maxLength={MAX_LENGTH.MAJOR}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <MonthPickerInput
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      placeholder="Pilih bulan"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Tanggal Selesai</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`edu-current-${index}`}
                          checked={edu.isCurrent || false}
                          onCheckedChange={(checked) => updateEducation(index, "isCurrent", checked === true)}
                          disabled={!edu.startDate}
                          className="cursor-pointer"
                        />
                        <label htmlFor={`edu-current-${index}`} className={`text-xs cursor-pointer ${!edu.startDate ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Saat Ini
                        </label>
                      </div>
                    </div>
                    <MonthPickerInput
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                      placeholder={!edu.startDate ? "Isi tanggal mulai dulu" : "Pilih bulan"}
                      disabled={edu.isCurrent || !edu.startDate}
                      className="bg-white text-neutral-900 hover:bg-neutral-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lokasi</Label>
                    <LocationInput
                      value={edu.location}
                      onChange={(e) => updateEducation(index, "location", e.target.value)}
                      placeholder="Pilih lokasi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>IPK</Label>
                    <GPAInput
                      gpa={edu.gpa}
                      maxGpa={edu.maxGpa || "4.0"}
                      onGpaChange={(value) => updateEducation(index, "gpa", value)}
                      onMaxGpaChange={(value) => updateEducation(index, "maxGpa", value)}
                    />
                  </div>

                  <div className="space-y-2 @md:col-span-2">
                    <Label>Deskripsi</Label>
                    <RichTextEditor
                      value={getDescriptionHtml(edu)}
                      onChange={(value: string) => {
                        const updated = [...data.educations];
                        updated[index] = { ...updated[index], ...updateDescription(value) };
                        setData((prev) => ({ ...prev, educations: updated }));
                      }}
                      placeholder="Deskripsi pencapaian akademik, organisasi kampus, dll..."
                      maxLength={MAX_LENGTH.DESCRIPTION}
                    />
                  </div>
                </div>
              </CollapsibleCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addEducation} className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
        <Plus className="w-4 h-4 mr-2" />
        Tambah Pendidikan
      </Button>
    </div>
  );
}
