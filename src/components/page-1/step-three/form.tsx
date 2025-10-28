"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WorkExperience } from "@/types/form-data";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StepThreeFormProps {
  formData: {
    workExperiences: WorkExperience[];
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

export function StepThreeForm({
  formData,
  formErrors,
  handleChange,
  addSectionItem,
  removeSectionItem,
}: StepThreeFormProps) {
  const { workExperiences } = formData;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  useEffect(() => {
    const errorIndexes = workExperiences
      .map((_, i) => i)
      .filter(
        (i) =>
          formErrors[`description-${i}`] ||
          formErrors[`position-${i}`] ||
          formErrors[`company-${i}`]
      );

    setOpenIndexes((prev) => Array.from(new Set([...prev, ...errorIndexes])));
  }, [formErrors, workExperiences]);

  const handleDeleteClick = (index: number) => {
    setTargetIndex(index);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetIndex !== null) removeSectionItem("workExperiences", targetIndex);
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
      {workExperiences.map((exp, i) => (
        <div
          key={i}
          className="relative space-y-6 rounded-lg border-2 bg-white px-6 pb-6 pt-2 shadow-sm"
        >
          <div
            className="-mx-6 px-6 pb-2 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleDropdown(i)}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Perusahaan {i + 1}
            </h2>

            <div className="flex items-center gap-2">
              {workExperiences.length > 1 && (
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
                    onChange={(e) => handleChange(e, "workExperiences", i)}
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
                  <Label htmlFor={`company-${i}`} className="mb-1 block">
                    Perusahaan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={exp.company}
                    onChange={(e) => handleChange(e, "workExperiences", i)}
                    placeholder="Nama Perusahaan"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`company-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`company-${i}`]}
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
                    onChange={(e) => handleChange(e, "workExperiences", i)}
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
                    onChange={(e) => handleChange(e, "workExperiences", i)}
                    placeholder="MM / YYYY"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <Label htmlFor={`city-${i}`} className="mb-1 block">
                    Kota
                  </Label>
                  <Input
                    id="city"
                    value={exp.city}
                    onChange={(e) => handleChange(e, "workExperiences", i)}
                    placeholder="Nama Kota"
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
                  onChange={(e) => handleChange(e, "workExperiences", i)}
                  placeholder="Ceritakan tanggung jawab dan pencapaianmu di posisi ini..."
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
          const newIndex = workExperiences.length;
          addSectionItem("workExperiences");
          setOpenIndexes((prev) => [...prev, newIndex]);
        }}
        className="text-emerald-500 font-semibold hover:bg-transparent hover:text-emerald-600 ml-2"
        variant="ghost"
      >
        + Tambah pekerjaan lain
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
