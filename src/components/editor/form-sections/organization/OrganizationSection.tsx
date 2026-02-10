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
import { OrganizationExperience } from "@/types/editor-form-data";
import { EditableSectionHeader } from "@/components/editor/ui/editable-section-header";
import { CollapsibleCard } from "@/components/editor/ui/collapsible-card";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MAX_LENGTH, truncateToMaxLength } from "@/lib/validation/editor-validation";

// Helper to generate dynamic card header for organization
function getOrgHeader(org: OrganizationExperience): string {
  if (org.organization && org.position) return `${org.organization} - ${org.position}`;
  if (org.organization) return org.organization;
  if (org.position) return org.position;
  return "Organisasi Baru";
}

// Organization Section - Tips
const ORG_TIPS = [
  "Tunjukkan leadership dan soft skills-mu",
  "Fokus pada dampak dan hasil yang kamu capai",
  "Sertakan jumlah tim yang kamu pimpin jika relevan",
  "Drag untuk mengubah urutan",
];

// Organization Experience Section
export function OrganizationSection({ data, setData }: FormSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateSectionTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      sectionTitles: { ...prev.sectionTitles, organization: title },
    }));
  };

  const updateOrganization = (index: number, field: string, value: string | string[] | boolean) => {
    const updated = [...data.organizationExperiences];

    // Apply maxLength truncation for string fields
    let processedValue = value;
    if (typeof value === "string") {
      switch (field) {
        case "position":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.POSITION);
          break;
        case "organization":
          processedValue = truncateToMaxLength(value, MAX_LENGTH.ORGANIZATION);
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

    setData((prev) => ({ ...prev, organizationExperiences: updated }));
  };

  const addOrganization = () => {
    setData((prev) => ({
      ...prev,
      organizationExperiences: [
        ...prev.organizationExperiences,
        {
          id: `org-${Date.now()}`,
          position: "",
          organization: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [],
        },
      ],
    }));
  };

  const removeOrganization = (index: number) => {
    setData((prev) => ({
      ...prev,
      organizationExperiences: prev.organizationExperiences.filter((_, i) => i !== index),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.organizationExperiences.findIndex((e) => (e.id || `org-${data.organizationExperiences.indexOf(e)}`) === active.id);
      const newIndex = data.organizationExperiences.findIndex((e) => (e.id || `org-${data.organizationExperiences.indexOf(e)}`) === over.id);
      setData((prev) => ({
        ...prev,
        organizationExperiences: arrayMove(prev.organizationExperiences, oldIndex, newIndex),
      }));
    }
  };

  // Ensure all items have IDs
  const orgWithIds = data.organizationExperiences.map((org, idx) => ({
    ...org,
    id: org.id || `org-${idx}`,
  }));

  return (
    <div className="space-y-6">
      <EditableSectionHeader
        title={data.sectionTitles?.organization || "Organisational Experience"}
        defaultTitle="Organisational Experience"
        onTitleChange={updateSectionTitle}
        tips={ORG_TIPS}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orgWithIds.map((e) => e.id!)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {orgWithIds.map((org, index) => (
              <CollapsibleCard
                key={org.id}
                id={org.id!}
                title={getOrgHeader(org)}
                onRemove={() => removeOrganization(index)}
                defaultExpanded={index === 0}
              >
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Posisi</Label>
                    <Input
                      value={org.position}
                      onChange={(e) => updateOrganization(index, "position", e.target.value)}
                      placeholder="Ketua Divisi"
                      maxLength={MAX_LENGTH.POSITION}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nama Organisasi</Label>
                    <Input
                      value={org.organization}
                      onChange={(e) => updateOrganization(index, "organization", e.target.value)}
                      placeholder="Himpunan Mahasiswa Informatika"
                      maxLength={MAX_LENGTH.ORGANIZATION}
                      className="text-neutral-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Mulai</Label>
                    <MonthPickerInput
                      value={org.startDate}
                      onChange={(e) => updateOrganization(index, "startDate", e.target.value)}
                      placeholder="Pilih bulan"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Tanggal Selesai</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`org-current-${index}`}
                          checked={org.isCurrent || false}
                          onCheckedChange={(checked) => updateOrganization(index, "isCurrent", checked === true)}
                          disabled={!org.startDate}
                          className="cursor-pointer"
                        />
                        <label htmlFor={`org-current-${index}`} className={`text-xs cursor-pointer ${!org.startDate ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Saat Ini
                        </label>
                      </div>
                    </div>
                    <MonthPickerInput
                      value={org.endDate}
                      onChange={(e) => updateOrganization(index, "endDate", e.target.value)}
                      placeholder={!org.startDate ? "Isi tanggal mulai dulu" : "Pilih bulan"}
                      disabled={org.isCurrent || !org.startDate}
                      className="bg-white text-neutral-900 hover:bg-neutral-50"
                    />
                  </div>

                  <div className="space-y-2 @md:col-span-2">
                    <Label>Deskripsi Kegiatan</Label>
                    <RichTextEditor
                      value={getDescriptionHtml(org)}
                      onChange={(value: string) => {
                        const updated = [...data.organizationExperiences];
                        updated[index] = { ...updated[index], ...updateDescription(value) };
                        setData((prev) => ({ ...prev, organizationExperiences: updated }));
                      }}
                      placeholder="Contoh: Memimpin tim 10 orang untuk event X..."
                      maxLength={MAX_LENGTH.DESCRIPTION}
                    />
                  </div>
                </div>
              </CollapsibleCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addOrganization} className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
        <Plus className="w-4 h-4 mr-2" />
        Tambah Pengalaman Organisasi
      </Button>
    </div>
  );
}
