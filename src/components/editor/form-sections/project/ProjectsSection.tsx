"use client";

import { useState } from "react";
import { Plus, GripVertical, Trash2, ChevronDown } from "lucide-react";
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

import { FormSectionProps } from "../common/types";
import { getDescriptionHtml, updateDescription } from "../common/helpers";
import { PersonalProject } from "@/types/editor-form-data";
import { EditableSectionHeader } from "@/components/editor/ui/editable-section-header";
import { CollapsibleCard } from "@/components/editor/ui/collapsible-card";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// Projects Section - Tips
const PROJECT_TIPS = [
  "Sebutkan tech stack yang digunakan",
  "Jelaskan masalah yang diselesaikan",
  "Sertakan link demo/repo jika ada",
  "Tanggal bersifat opsional",
  "Drag untuk mengubah urutan",
];

// Helper to generate dynamic card header for project
function getProjectHeader(project: PersonalProject): string {
  if (project.name) return project.name;
  return "Proyek Baru";
}

// Projects Section - now with dates like Work/Org
export function ProjectsSection({ data, setData }: FormSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateSectionTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      sectionTitles: { ...prev.sectionTitles, projects: title },
    }));
  };

  const updateProject = (index: number, field: string, value: string | string[] | boolean) => {
    const updated = [...(data.personalProjects || [])];
    updated[index] = { ...updated[index], [field]: value };
    
    // If "Saat Ini" is checked, clear endDate
    if (field === "isCurrent" && value === true) {
      updated[index] = { ...updated[index], endDate: "" };
    }
    
    // If startDate is cleared, also clear endDate and isCurrent
    if (field === "startDate" && !value) {
      updated[index] = { ...updated[index], endDate: "", isCurrent: false };
    }
    
    setData((prev) => ({ ...prev, personalProjects: updated }));
  };

  const addProject = () => {
    setData((prev) => ({
      ...prev,
      personalProjects: [
        ...(prev.personalProjects || []),
        {
          id: `proj-${Date.now()}`,
          name: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [],
          descriptionHtml: "",
        },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setData((prev) => ({
      ...prev,
      personalProjects: (prev.personalProjects || []).filter((_, i) => i !== index),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const projects = data.personalProjects || [];
      const oldIndex = projects.findIndex((e) => (e.id || `proj-${projects.indexOf(e)}`) === active.id);
      const newIndex = projects.findIndex((e) => (e.id || `proj-${projects.indexOf(e)}`) === over.id);
      setData((prev) => ({
        ...prev,
        personalProjects: arrayMove(prev.personalProjects || [], oldIndex, newIndex),
      }));
    }
  };

  // Ensure all items have IDs
  const projectsWithIds = (data.personalProjects || []).map((proj, idx) => ({
    ...proj,
    id: proj.id || `proj-${idx}`,
  }));

  return (
    <div className="space-y-6">
      <EditableSectionHeader
        title={data.sectionTitles?.projects || "Projects"}
        defaultTitle="Projects"
        onTitleChange={updateSectionTitle}
        tips={PROJECT_TIPS}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projectsWithIds.map((e) => e.id!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {projectsWithIds.map((project, index) => (
              <CollapsibleCard
                key={project.id}
                id={project.id!}
                title={getProjectHeader(project)}
                onRemove={() => removeProject(index)}
                defaultExpanded={index === 0}
              >
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Proyek</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                      placeholder="Nama proyek atau produk"
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role / Posisi</Label>
                    <Input
                      value={project.role || ""}
                      onChange={(e) => updateProject(index, "role", e.target.value)}
                      placeholder="Lead Developer, etc."
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <MonthPickerInput
                      value={project.startDate || ""}
                      onChange={(e) => updateProject(index, "startDate", e.target.value)}
                      placeholder="Pilih bulan"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Tanggal Selesai</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`proj-current-${index}`}
                          checked={project.isCurrent || false}
                          onCheckedChange={(checked) => updateProject(index, "isCurrent", checked === true)}
                          disabled={!project.startDate}
                          className="cursor-pointer"
                        />
                        <label htmlFor={`proj-current-${index}`} className={`text-xs cursor-pointer ${!project.startDate ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Saat Ini
                        </label>
                      </div>
                    </div>
                    <MonthPickerInput
                      value={project.endDate || ""}
                      onChange={(e) => updateProject(index, "endDate", e.target.value)}
                      placeholder={!project.startDate ? "Isi tanggal mulai dulu" : "Pilih bulan"}
                      disabled={project.isCurrent || !project.startDate}
                    />
                  </div>

                  <div className="space-y-2 @md:col-span-2">
                    <Label>Deskripsi</Label>
                    <RichTextEditor
                      value={getDescriptionHtml(project)}
                      onChange={(value: string) => {
                        const updated = [...(data.personalProjects || [])];
                        updated[index] = { ...updated[index], ...updateDescription(value) };
                        setData((prev) => ({ ...prev, personalProjects: updated }));
                      }}
                      placeholder="Tech stack, fitur utama, hasil yang dicapai..."
                    />
                  </div>
                </div>
              </CollapsibleCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addProject} className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
        <Plus className="w-4 h-4 mr-2" />
        Tambah Proyek
      </Button>
    </div>
  );
}
