"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WorkExperience } from "@/types/form-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { LocationInput } from "@/components/ui/location-input";
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

export function StepThreeForm({
  formData,
  formErrors,
  handleChange,
  addSectionItem,
  removeSectionItem,
  openIndexes,
  setOpenIndexes,
}: StepThreeFormProps) {
  const { workExperiences } = formData;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

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
                    Waktu Mulai <span className="text-red-500">*</span>
                  </Label>
                  <MonthPickerInput
                    id="startDate"
                    value={exp.startDate}
                    onChange={(e) => handleChange(e, "workExperiences", i)}
                    placeholder="Pilih Bulan"
                  />
                  {formErrors[`startDate-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`startDate-${i}`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`endDate-${i}`} className="mb-1 block">
                    Waktu Akhir <span className="text-red-500">*</span>
                  </Label>
                  <MonthPickerInput
                    id="endDate"
                    value={exp.endDate === "Saat Ini" ? "" : exp.endDate}
                    onChange={(e) => handleChange(e, "workExperiences", i)}
                    placeholder="Pilih Bulan"
                    disabled={exp.endDate === "Saat Ini"}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id={`isOngoing-${i}`}
                      checked={exp.endDate === "Saat Ini"}
                      onCheckedChange={(checked) => {
                        const syntheticEvent = {
                          target: {
                            id: "endDate",
                            value: checked ? "Saat Ini" : "",
                          },
                        } as ChangeEvent<HTMLInputElement>;
                        handleChange(syntheticEvent, "workExperiences", i);
                      }}
                    />
                    <Label
                      htmlFor={`isOngoing-${i}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      Saat Ini
                    </Label>
                  </div>
                  {formErrors[`endDate-${i}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[`endDate-${i}`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`location-${i}`} className="mb-1 block">
                    Lokasi
                  </Label>
                  <LocationInput
                    id="location"
                    value={exp.location}
                    onChange={(e) => handleChange(e, "workExperiences", i)}
                    placeholder="Pilih lokasi"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${i}`} className="mb-1 block">
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <TextArea
                  id="description"
                  value={exp.description[0] || ""}
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
