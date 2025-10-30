"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import type { OrganizationExperience } from "@/types/form-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StepFourFormProps {
  formData: {
    organizationExperiences: OrganizationExperience[];
  };
  formErrors: Record<string, string>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?:
      | "root"
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
}

export function StepFourForm({
  formData,
  formErrors,
  handleChange,
  addSectionItem,
  removeSectionItem,
}: StepFourFormProps) {
  const { organizationExperiences } = formData;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  useEffect(() => {
    const errorIndexes = organizationExperiences
      .map((_, i) => i)
      .filter(
        (i) =>
          formErrors[`description-${i}`] ||
          formErrors[`position-${i}`] ||
          formErrors[`organization-${i}`]
      );

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
    <div className="space-y-2">
      {organizationExperiences.map((exp, i) => (
        <div
          key={i}
          className="relative space-y-6 rounded-lg border-2 bg-white px-6 pb-6 pt-2 shadow-sm"
        >
          <div
            className="-mx-6 px-6 pb-2 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleDropdown(i)}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Organisasi {i + 1}
            </h2>

            <div className="flex items-center gap-2">
              {organizationExperiences.length > 1 && (
                <Trash
                  size={15}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(i);
                  }}
                />
              )}

              {openIndexes.includes(i) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>

          {openIndexes.includes(i) && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`position-${i}`} className="mb-1 block">
                    Jabatan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    value={exp.position}
                    onChange={(e) =>
                      handleChange(e, "organizationExperiences", i)
                    }
                    placeholder="Jabatan"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`position-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`position-${i}`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`organization-${i}`} className="mb-1 block">
                    Organisasi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organization"
                    value={exp.organization}
                    onChange={(e) =>
                      handleChange(e, "organizationExperiences", i)
                    }
                    placeholder="Nama Organisasi"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`organization-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`organization-${i}`]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor={`startDate-${i}`} className="mb-1 block">
                    Tanggal Mulai
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleChange(e, "organizationExperiences", i)
                    }
                    placeholder="MM / YYYY"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <Label htmlFor={`endDate-${i}`} className="mb-1 block">
                    Tanggal Akhir
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleChange(e, "organizationExperiences", i)
                    }
                    placeholder="MM / YYYY"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <Label htmlFor={`location-${i}`} className="mb-1 block">
                    Lokasi
                  </Label>
                  <Input
                    id="location"
                    value={exp.location}
                    onChange={(e) =>
                      handleChange(e, "organizationExperiences", i)
                    }
                    placeholder="Lokasi"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${i}`} className="mb-1 block">
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <TextArea
                  id="description"
                  value={exp.description}
                  onChange={(e) =>
                    handleChange(e, "organizationExperiences", i)
                  }
                  placeholder="Ceritakan pengalamanmu selama berorganisasi"
                  className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                />
                {formErrors[`description-${i}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors[`description-${i}`]}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      <Button
        type="button"
        onClick={() => {
          const newIndex = organizationExperiences.length;
          addSectionItem("organizationExperiences");
          setOpenIndexes((prev) => [...prev, newIndex]);
        }}
        className="text-emerald-500 font-semibold hover:bg-transparent hover:text-emerald-600 ml-2"
        variant="ghost"
      >
        + Tambah organisasi lain
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
