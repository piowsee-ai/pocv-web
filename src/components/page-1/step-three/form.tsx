"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WorkExperience } from "@/types/form-data";
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
  handleWorkExperienceChange: (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => void;
  addWorkExperience: () => void;
  removeWorkExperience: (index: number) => void;
}

export function StepThreeForm({
  formData,
  formErrors,
  handleWorkExperienceChange,
  addWorkExperience,
  removeWorkExperience,
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
    if (targetIndex !== null) removeWorkExperience(targetIndex);
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
                    id={`position-${i}`}
                    value={exp.position}
                    onChange={(e) =>
                      handleWorkExperienceChange(i, "position", e.target.value)
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
                  <Label htmlFor={`company-${i}`} className="mb-1 block">
                    Perusahaan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`company-${i}`}
                    value={exp.company}
                    onChange={(e) =>
                      handleWorkExperienceChange(i, "company", e.target.value)
                    }
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
                    id={`startDate-${i}`}
                    value={exp.startDate}
                    onChange={(e) =>
                      handleWorkExperienceChange(i, "startDate", e.target.value)
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
                    id={`endDate-${i}`}
                    value={exp.endDate}
                    onChange={(e) =>
                      handleWorkExperienceChange(i, "endDate", e.target.value)
                    }
                    placeholder="MM / YYYY"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <Label htmlFor={`city-${i}`} className="mb-1 block">
                    Kota
                  </Label>
                  <Input
                    id={`city-${i}`}
                    value={exp.city}
                    onChange={(e) =>
                      handleWorkExperienceChange(i, "city", e.target.value)
                    }
                    placeholder="Nama Kota"
                    className="bg-neutral-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${i}`} className="mb-1 block">
                  Deskripsi
                </Label>
                <TextArea
                  id={`description-${i}`}
                  value={exp.description}
                  onChange={(e) =>
                    handleWorkExperienceChange(i, "description", e.target.value)
                  }
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
        onClick={()=>{
          const newIndex = workExperiences.length;
          addWorkExperience();
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
