"use client";

import { Plus } from "lucide-react";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MAX_LENGTH, truncateToMaxLength } from "@/lib/validation/editor-validation";

// Projects Section - Tips
const PROJECT_TIPS = [
  "Sebutkan tech stack yang digunakan",
  "Jelaskan masalah yang diselesaikan",
  "Sertakan link demo/repo jika ada",
  "Drag untuk mengubah urutan",
];

// Helper to generate dynamic card header for project
function getProjectHeader(project: PersonalProject): string {
  if (project.name) return project.name;
  return "Proyek Baru";
}

// Projects Section
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

    // Apply maxLength truncation for string fields
    let processedValue = value;
    if (typeof value === "string") {
      switch (field) {
        case "name":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.NAME);
          break;
      }
    }

    updated[index] = { ...updated[index], [field]: processedValue };
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
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Proyek</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                      placeholder="Nama proyek atau produk"
                      maxLength={MAX_LENGTH.NAME}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <RichTextEditor
                      value={getDescriptionHtml(project)}
                      onChange={(value: string) => {
                        const updated = [...(data.personalProjects || [])];
                        updated[index] = { ...updated[index], ...updateDescription(value) };
                        setData((prev) => ({ ...prev, personalProjects: updated }));
                      }}
                      placeholder="Tech stack, fitur utama, hasil yang dicapai..."
                      maxLength={MAX_LENGTH.DESCRIPTION}
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
