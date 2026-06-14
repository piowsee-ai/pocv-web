"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DegreeSelect } from "@/components/create/step-two/degree-select";
import { GpaScaleSelect } from "@/components/create/step-two/gpa-scale-select";
import { LocationInput } from "@/components/ui/location-input";
import { MonthPickerInput } from "@/components/ui/month-picker-input";
import { ChevronDown, Trash2, Plus } from "lucide-react";
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

export function StepTwoForm({
  formData,
  formErrors,
  handleChange,
  addSectionItem,
  removeSectionItem,
  openIndexes,
  setOpenIndexes,
}: StepTwoFormProps) {
  const { educations } = formData;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

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
    <div className="space-y-4">
      {educations.map((exp, i) => (
        <div
          key={i}
          className="rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden"
        >
          <div
            className="px-4 py-3 bg-white border-b border-neutral-100 flex justify-between items-center cursor-pointer"
            onClick={() => toggleDropdown(i)}
          >
            <span className="text-sm font-semibold text-emerald-700">
              Pendidikan {i + 1}
            </span>

            <div className="flex items-center gap-2">
              {educations.length > 1 && (
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${i}`}>
                      Institusi <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="institution"
                      value={exp.institution}
                      onChange={(e) => handleChange(e, "educations", i)}
                      placeholder="Universitas / Sekolah"
                      className="text-neutral-900"
                    />
                    {formErrors[`institution-${i}`] && (
                      <p className="text-sm text-red-500">
                        {formErrors[`institution-${i}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`degree-${i}`}>
                      Gelar <span className="text-red-500">*</span>
                    </Label>
                    <DegreeSelect
                      id="degree"
                      value={exp.degree}
                      onChange={(e) => handleChange(e, "educations", i)}
                    />
                    {formErrors[`degree-${i}`] && (
                      <p className="text-sm text-red-500">
                        {formErrors[`degree-${i}`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`major-${i}`}>
                      Program Studi <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="major"
                      value={exp.major}
                      onChange={(e) => handleChange(e, "educations", i)}
                      placeholder="Teknik Informatika, Manajemen, dll"
                      className="text-neutral-900"
                    />
                    {formErrors[`major-${i}`] && (
                      <p className="text-sm text-red-500">
                        {formErrors[`major-${i}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`gpa-${i}`}>Nilai Akhir</Label>
                    <div className="flex gap-2">
                      <Input
                        id="gpa"
                        value={exp.gpa?.split(" / ")[0] || ""}
                        onChange={(e) => {
                          const numericValue = e.target.value;
                          const currentScale = exp.gpa?.split(" / ")[1] || "4.0";

                          if (numericValue !== "") {
                            const numVal = parseFloat(numericValue);
                            const scaleLimit = parseFloat(currentScale);
                            if (!isNaN(numVal) && !isNaN(scaleLimit) && numVal > scaleLimit) {
                              return;
                            }
                          }

                          const syntheticEvent = {
                            target: {
                              id: "gpa",
                              value: numericValue ? `${numericValue} / ${currentScale}` : (exp.gpa?.split(" / ")[1] ? ` / ${currentScale}` : ""),
                            },
                          } as ChangeEvent<HTMLInputElement>;
                          handleChange(syntheticEvent, "educations", i);
                        }}
                        placeholder="3.5"
                        className="flex-1 text-neutral-900"
                      />
                      <GpaScaleSelect
                        id="gpa"
                        value={exp.gpa?.split(" / ")[1] || ""}
                        onChange={(e) => {
                          const currentNumeric = exp.gpa?.split(" / ")[0]?.trim() || "";
                          const newScale = e.target.value;

                          let validNumeric = currentNumeric;
                          if (currentNumeric !== "") {
                            const numVal = parseFloat(currentNumeric);
                            const scaleLimit = parseFloat(newScale);
                            if (!isNaN(numVal) && !isNaN(scaleLimit) && numVal > scaleLimit) {
                              validNumeric = "";
                            }
                          }

                          const syntheticEvent = {
                            target: {
                              id: "gpa",
                              value: validNumeric ? `${validNumeric} / ${newScale}` : ` / ${newScale}`,
                            },
                          } as ChangeEvent<HTMLInputElement>;
                          handleChange(syntheticEvent, "educations", i);
                        }}
                        className="w-28"
                      />
                    </div>
                    {formErrors[`gpa-${i}`] && (
                      <p className="text-sm text-red-500">
                        {formErrors[`gpa-${i}`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${i}`}>
                      Waktu Mulai <span className="text-red-500">*</span>
                    </Label>
                    <MonthPickerInput
                      id="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleChange(e, "educations", i)}
                      placeholder="Pilih Bulan"
                    />
                    {formErrors[`startDate-${i}`] && (
                      <p className="text-sm text-red-500">
                        {formErrors[`startDate-${i}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${i}`}>
                      Waktu Akhir <span className="text-red-500">*</span>
                    </Label>
                    <MonthPickerInput
                      id="endDate"
                      value={exp.endDate === "Saat Ini" ? "" : exp.endDate}
                      onChange={(e) => handleChange(e, "educations", i)}
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
                          handleChange(syntheticEvent, "educations", i);
                        }}
                      />
                      <Label
                        htmlFor={`isOngoing-${i}`}
                        className="text-sm font-normal text-neutral-500 cursor-pointer"
                      >
                        Saat Ini
                      </Label>
                    </div>
                    {formErrors[`endDate-${i}`] && (
                      <p className="text-sm text-red-500">
                        {formErrors[`endDate-${i}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${i}`}>Lokasi</Label>
                    <LocationInput
                      id="location"
                      value={exp.location}
                      onChange={(e) => handleChange(e, "educations", i)}
                      placeholder="Pilih lokasi"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${i}`}>
                    Deskripsi <span className="text-red-500">*</span>
                  </Label>
                  <TextArea
                    id="description"
                    value={exp.description[0]}
                    onChange={(e) => handleChange(e, "educations", i)}
                    placeholder="Tulis riwayat pendidikanmu secara bebas, misalnya: Saya menyelesaikan studi di Universitas Indonesia jurusan Ekonomi, dengan fokus pada analisis data dan manajemen bisnis."
                    className="min-h-[100px] text-neutral-900"
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
        variant="outline"
        onClick={() => {
          const newIndex = educations.length;
          addSectionItem("educations");
          setOpenIndexes((prev) => [...prev, newIndex]);
        }}
        className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Tambah pendidikan lain
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
