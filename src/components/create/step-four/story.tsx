"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { OrganizationExperience } from "@/types/form-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StepFourStoryProps {
  formData: {
    organizationExperiences: OrganizationExperience[];
  };
  formErrors: Record<string, string>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?:
      | "personalData"
      | "educations"
      | "workExperiences"
      | "organizationExperiences",
    index?: number
  ) => void;
  addSectionItem: (
    section: "educations" | "workExperiences" | "organizationExperiences"
  ) => void;
  removeSectionItem: (
    section: "educations" | "workExperiences" | "organizationExperiences",
    index: number
  ) => void;
  openIndexes: number[];
  setOpenIndexes: React.Dispatch<React.SetStateAction<number[]>>;
}

export function StepFourStory({
  formData,
  formErrors,
  handleChange,
  addSectionItem,
  removeSectionItem,
  openIndexes,
  setOpenIndexes,
}: StepFourStoryProps) {
  const { organizationExperiences } = formData;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    const errorIndexes = organizationExperiences
      .map((_, i) => i)
      .filter((i) => formErrors[`description-${i}`]);

    setOpenIndexes((prev) => Array.from(new Set([...prev, ...errorIndexes])));
  }, [formErrors, organizationExperiences]);

  const handleDeleteClick = (index: number) => {
    setTargetIndex(index);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetIndex !== null)
      removeSectionItem("organizationExperiences", targetIndex);
    setDialogOpen(false);
    setTargetIndex(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setTargetIndex(null);
  };

  const toggleDropdown = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {organizationExperiences.map((exp, i) => (
        <div
          key={i}
          className="rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden"
        >
          <div
            className="px-4 py-3 bg-white border-b border-neutral-100 flex justify-between items-center cursor-pointer"
            onClick={() => toggleDropdown(i)}
          >
            <h2 className="text-sm font-semibold text-emerald-700">
              Organisasi {i + 1}
            </h2>
            <div className="flex items-center gap-2">
              {organizationExperiences.length > 1 && (
                <button
                  type="button"
                  className="p-1 rounded hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(i);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                </button>
              )}

              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                  openIndexes.includes(i) ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          <div
            className="grid transition-all duration-200"
            style={{
              gridTemplateRows: openIndexes.includes(i) ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`description-${i}`}>
                    Ceritakan Pengalamanmu <span className="text-red-500">*</span>
                  </Label>
                  <TextArea
                    id="description"
                    value={exp.description[0] || ""}
                    onChange={(e) =>
                      handleChange(e, "organizationExperiences", i)
                    }
                    placeholder="Ceritakan pengalamanmu selama berorganisasi"
                    className="text-neutral-900 min-h-[100px]"
                  />
                  {formErrors[`description-${i}`] && (
                    <p className="text-sm text-red-500">
                      {formErrors[`description-${i}`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={() => {
          const newIndex = organizationExperiences.length;
          addSectionItem("organizationExperiences");
          setOpenIndexes((prev) => [...prev, newIndex]);
        }}
        variant="outline"
        className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Tambah organisasi lain
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pengalaman</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengalaman ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
