"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import type { Education } from "@/types/form-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface StepTwoFormProps {
  formData: {
    educations: Education[];
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

export function StepTwoForm({
  formData,
  formErrors,
  handleChange,
  addSectionItem,
  removeSectionItem,
}: StepTwoFormProps) {
  const { educations } = formData;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  useEffect(() => {
    const errorIndexes = educations
      .map((_, i) => i)
      .filter(
        (i) =>
          formErrors[`degree-${i}`] ||
          formErrors[`institution-${i}`] ||
          formErrors[`major-${i}`] ||
          formErrors[`description-${i}`]
      );

    setOpenIndexes((prev) => Array.from(new Set([...prev, ...errorIndexes])));
  }, [formErrors, educations]);

  const handleDeleteClick = (index: number) => {
    setTargetIndex(index);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetIndex !== null) removeSectionItem("educations", targetIndex);
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
      {educations.map((exp, i) => (
        <div
          key={i}
          className="relative space-y-6 rounded-lg border-2 bg-white px-6 pb-6 pt-2 shadow-sm"
        >
          <div
            className="-mx-6 px-6 pb-2 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleDropdown(i)}
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Pendidikan {i + 1}
            </h2>

            <div className="flex items-center gap-2">
              {educations.length > 1 && (
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
                  <Label htmlFor={`institution-${i}`} className="mb-1 block">
                    Institusi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="institution"
                    value={exp.institution}
                    onChange={(e) => handleChange(e, "educations", i)}
                    placeholder="Universitas / Sekolah"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`institution-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`institution-${i}`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`degree-${i}`} className="mb-1 block">
                    Gelar <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="degree"
                    value={exp.degree}
                    onChange={(e) => handleChange(e, "educations", i)}
                    placeholder="Sarjana 1 (S1), Diploma 3 (D3), SMA, dll"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`degree-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`degree-${i}`]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`major-${i}`} className="mb-1 block">
                    Program Studi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="major"
                    value={exp.major}
                    onChange={(e) => handleChange(e, "educations", i)}
                    placeholder="Teknik Informatika, Manajemen, dll"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`major-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`major-${i}`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`gpa-${i}`} className="mb-1 block">
                    Nilai Akhir
                  </Label>
                  <Input
                    id="gpa"
                    value={exp.gpa}
                    onChange={(e) => handleChange(e, "educations", i)}
                    placeholder="XX.X / 4.0, XX.X / 5.0, atau XX.X / 100"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {formErrors[`gpa-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`gpa-${i}`]}
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
                    onChange={(e) => handleChange(e, "educations", i)}
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
                    onChange={(e) => handleChange(e, "educations", i)}
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
                    onChange={(e) => handleChange(e, "educations", i)}
                    placeholder="Jakarta, Bandung, Surabaya, dll"
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
                  onChange={(e) => handleChange(e, "educations", i)}
                  placeholder="Tulis riwayat pendidikanmu secara bebas, misalnya: Saya menyelesaikan studi di Universitas Indonesia jurusan Ekonomi, dengan fokus pada analisis data dan manajemen bisnis."
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
          const newIndex = educations.length;
          addSectionItem("educations");
          setOpenIndexes((prev) => [...prev, newIndex]);
        }}
        className="text-emerald-500 font-semibold hover:bg-transparent hover:text-emerald-600 ml-2"
        variant="ghost"
      >
        + Tambah pendidikan lain
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pendidikan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pendidikan ini?
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
