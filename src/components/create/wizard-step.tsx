"use client";

import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, ChevronLeft, ChevronRight, Send } from "lucide-react";

import { StepOneForm } from "@/components/create/step-one/form";
import { StepTwoForm } from "@/components/create/step-two/form";
import { StepTwoStory } from "@/components/create/step-two/story";
import { StepThreeForm } from "@/components/create/step-three/form";
import { StepThreeStory } from "@/components/create/step-three/story";
import { StepFourForm } from "@/components/create/step-four/form";
import { StepFourStory } from "@/components/create/step-four/story";

import type { FormData } from "@/types/form-data";

const STEPS = [
  { id: 1, label: "Pribadi" },
  { id: 2, label: "Pendidikan" },
  { id: 3, label: "Profesional" },
  { id: 4, label: "Organisasi" },
];

export function WizardStep() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [useDefaultInputEdu, setUseDefaultInputEdu] = useState(true);
  const [useDefaultInputWork, setUseDefaultInputWork] = useState(true);
  const [useDefaultInputOrg, setUseDefaultInputOrg] = useState(true);
  const [skipOrganizationExperience, setSkipOrganizationExperience] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    personalData: {
      name: "",
      phone: "",
      linkedin: "",
      email: "",
      github: "",
      location: "",
      website: "",
    },
    summary: "",
    educations: [
      {
        degree: "",
        major: "",
        institution: "",
        startDate: "",
        endDate: "",
        location: "",
        gpa: "",
        description: [],
      },
    ],
    workExperiences: [
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        location: "",
        description: [],
      },
    ],
    organizationExperiences: [
      {
        position: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: [],
      },
    ],
    personalProjects: [],
    additional: {
      skills: [],
      languages: [],
      certifications: [],
      achievements: [],
    },
    customSections: [],
  });

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  // State for open blocks in each step (lifted from form components)
  const [openIndexesEdu, setOpenIndexesEdu] = useState<number[]>([0]);
  const [openIndexesWork, setOpenIndexesWork] = useState<number[]>([0]);
  const [openIndexesOrg, setOpenIndexesOrg] = useState<number[]>([0]);

  type SectionType =
    | "educations"
    | "workExperiences"
    | "organizationExperiences"
    | "personalData";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: SectionType = "personalData",
    index?: number,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      if (section === "personalData") {
        return {
          ...prev,
          personalData: {
            ...prev.personalData,
            [id]: value,
          },
        };
      }

      const updatedArray = [...prev[section]];
      if (index !== undefined) {
        // Special handling for description to ensure it remains an array
        if (id === "description") {
          updatedArray[index] = { ...updatedArray[index], [id]: [value] };
        } else {
          updatedArray[index] = { ...updatedArray[index], [id]: value };
        }
      }

      return { ...prev, [section]: updatedArray };
    });

    setFormErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  type ArraySection = Exclude<SectionType, "personalData">;

  const createEmptyItem = (section: ArraySection) => {
    switch (section) {
      case "educations":
        return {
          degree: "",
          major: "",
          institution: "",
          startDate: "",
          endDate: "",
          location: "",
          gpa: "",
          description: [],
        };
      case "workExperiences":
        return {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          location: "",
          description: [],
        };
      case "organizationExperiences":
        return {
          position: "",
          organization: "",
          startDate: "",
          endDate: "",
          description: [],
        };
      default:
        throw new Error("Invalid section type");
    }
  };

  const addSectionItem = (section: ArraySection) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], createEmptyItem(section)],
    }));
  };

  const removeSectionItem = (section: ArraySection, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const validateStepData = useCallback(
    (targetStep: number): boolean => {
      const errors: Record<string, string> = {};

      if (targetStep === 1) {
        if (!formData.personalData.name) errors.name = "Nama Lengkap harus diisi.";

        if (!formData.personalData.phone) {
          errors.phone = "Nomor Telepon harus diisi.";
        } else if (!/^\d{10,15}$/.test(formData.personalData.phone)) {
          errors.phone = "Nomor Telepon harus berupa 10-15 digit angka.";
        }

        if (!formData.personalData.email) {
          errors.email = "Alamat Email harus diisi.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalData.email)) {
          errors.email = "Format email tidak valid.";
        }

        if (formData.personalData.linkedin && !/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i.test(formData.personalData.linkedin)) {
          errors.linkedin = "Format LinkedIn URL tidak valid. Contoh: linkedin.com/in/username";
        }

        if (formData.personalData.github && !/^(https?:\/\/)?(www\.)?github\.com\/.+$/i.test(formData.personalData.github)) {
          errors.github = "Format GitHub URL tidak valid. Contoh: github.com/username";
        }

        if (!formData.educations) errors.education = "Pendidikan harus diisi.";
      }

      if (targetStep === 2) {
        formData.educations.forEach((exp, i) => {
          if (useDefaultInputEdu) {
            if (!exp.degree) errors[`degree-${i}`] = `Gelar harus diisi.`;
            if (!exp.major) errors[`major-${i}`] = `Program Studi harus diisi.`;
            if (!exp.institution) errors[`institution-${i}`] = `Institusi harus diisi.`;
            if (!exp.startDate) errors[`startDate-${i}`] = `Waktu Mulai harus diisi.`;
            if (!exp.endDate) errors[`endDate-${i}`] = `Waktu Akhir harus diisi.`;
          }
          if (!exp.description?.[0])
            errors[`description-${i}`] = `Deskripsi harus diisi.`;
        });
      }

      if (targetStep === 3) {
        formData.workExperiences.forEach((exp, i) => {
          if (useDefaultInputWork) {
            if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
            if (!exp.company) errors[`company-${i}`] = `Perusahaan harus diisi.`;
            if (!exp.startDate)
              errors[`startDate-${i}`] = `Waktu Mulai harus diisi.`;
            if (!exp.endDate) errors[`endDate-${i}`] = `Waktu Akhir harus diisi.`;
          }

          if (!exp.description?.[0])
            errors[`description-${i}`] = `Deskripsi harus diisi.`;
        });
      }

      if (targetStep === 4 && !skipOrganizationExperience) {
        formData.organizationExperiences.forEach((exp, i) => {
          if (useDefaultInputOrg) {
            if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
            if (!exp.organization)
              errors[`organization-${i}`] = `Nama organisasi harus diisi.`;
            if (!exp.startDate)
              errors[`startDate-${i}`] = `Waktu Mulai harus diisi.`;
            if (!exp.endDate) errors[`endDate-${i}`] = `Waktu Akhir harus diisi.`;
          }

          if (!exp.description?.[0])
            errors[`description-${i}`] = `Deskripsi harus diisi.`;
        });
      }

      return Object.keys(errors).length === 0;
    },
    [formData, useDefaultInputEdu, useDefaultInputWork, useDefaultInputOrg, skipOrganizationExperience],
  );

  const validateStep = () => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.personalData.name) errors.name = "Nama Lengkap harus diisi.";

      if (!formData.personalData.phone) {
        errors.phone = "Nomor Telepon harus diisi.";
      } else if (!/^\d{10,15}$/.test(formData.personalData.phone)) {
        errors.phone = "Nomor Telepon harus berupa 10-15 digit angka.";
      }

      if (!formData.personalData.email) {
        errors.email = "Alamat Email harus diisi.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalData.email)) {
        errors.email = "Format email tidak valid.";
      }

      if (formData.personalData.linkedin && !/^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i.test(formData.personalData.linkedin)) {
        errors.linkedin = "Format LinkedIn URL tidak valid. Contoh: linkedin.com/in/username";
      }

      if (formData.personalData.github && !/^(https?:\/\/)?(www\.)?github\.com\/.+$/i.test(formData.personalData.github)) {
        errors.github = "Format GitHub URL tidak valid. Contoh: github.com/username";
      }

      if (!formData.educations) errors.education = "Pendidikan harus diisi.";
    }
    if (step === 2) {
      formData.educations.forEach((exp, i) => {
        if (useDefaultInputEdu) {
          if (!exp.degree) errors[`degree-${i}`] = `Gelar harus diisi.`;
          if (!exp.major) errors[`major-${i}`] = `Program Studi harus diisi.`;
          if (!exp.institution) errors[`institution-${i}`] = `Institusi harus diisi.`;
          if (!exp.startDate) errors[`startDate-${i}`] = `Waktu Mulai harus diisi.`;
          if (!exp.endDate) errors[`endDate-${i}`] = `Waktu Akhir harus diisi.`;
        }
        if (!exp.description?.[0])
          errors[`description-${i}`] = `Deskripsi harus diisi.`;
      });
    }
    if (step === 3) {
      formData.workExperiences.forEach((exp, i) => {
        if (useDefaultInputWork) {
          if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
          if (!exp.company) errors[`company-${i}`] = `Perusahaan harus diisi.`;
          if (!exp.startDate)
            errors[`startDate-${i}`] = `Waktu Mulai harus diisi.`;
          if (!exp.endDate) errors[`endDate-${i}`] = `Waktu Akhir harus diisi.`;
        }

        if (!exp.description?.[0])
          errors[`description-${i}`] = `Deskripsi harus diisi.`;
      });
    }

    if (step === 4 && !skipOrganizationExperience) {
      formData.organizationExperiences.forEach((exp, i) => {
        if (useDefaultInputOrg) {
          if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
          if (!exp.organization)
            errors[`organization-${i}`] = `Nama organisasi harus diisi.`;
          if (!exp.startDate)
            errors[`startDate-${i}`] = `Waktu Mulai harus diisi.`;
          if (!exp.endDate) errors[`endDate-${i}`] = `Waktu Akhir harus diisi.`;
        }

        if (!exp.description?.[0])
          errors[`description-${i}`] = `Deskripsi harus diisi.`;
      });
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => validateStep() && setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleStepClick = (targetStepId: number) => {
    if (targetStepId === step) return;

    // Allow going back to any previous step freely
    if (targetStepId < step) {
      setStep(targetStepId);
      return;
    }

    // For going forward, all steps from current up to (targetStepId - 1) must be valid
    for (let s = 1; s < targetStepId; s++) {
      if (!validateStepData(s)) {
        // If current step is invalid, show errors for it
        if (s === step) {
          validateStep();
        }
        return;
      }
    }
    setStep(targetStepId);
  };

  const canNavigateToStep = (targetStepId: number): boolean => {
    if (targetStepId <= step) return true;
    for (let s = 1; s < targetStepId; s++) {
      if (!validateStepData(s)) return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep()) setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitDialogOpen(false);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const finalData = {
        ...formData,
        organizationExperiences: skipOrganizationExperience
          ? []
          : formData.organizationExperiences,
      };

      // Call the generate API
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: finalData,
          options: {
            provider: process.env.DEFAULT_LLM_PROVIDER,
            isPreview: false,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate CV");
      }

      // Parse enhanced data from API
      const result = await response.json();

      // route to editor page with cvId
      router.push(`/editor/${result.cvId}`);
    } catch (error) {
      console.error("Error generating CV:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat CV",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (100 / 4) * step;

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="min-h-screen border-x border-neutral-200 bg-white">
          <div className="flex min-h-screen flex-col">
            <div className="sticky top-0 z-40 pt-6">
              <div className="border-b border-neutral-100 bg-white px-6 pt-5 pb-4 sm:px-8">
                <div className="mb-3 flex items-center justify-between">
                  {STEPS.map((s, idx) => {
                    const navigable = canNavigateToStep(s.id);
                    return (
                      <div key={s.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() => handleStepClick(s.id)}
                            disabled={!navigable}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                              navigable ? "cursor-pointer" : "cursor-not-allowed"
                            } ${
                              step === s.id
                                ? "bg-emerald-600 text-white"
                                : step > s.id
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                  : navigable
                                    ? "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                                    : "bg-neutral-100 text-neutral-400"
                            }`}
                          >
                            {s.id}
                          </button>
                          <span
                            className={`mt-1.5 text-xs font-medium ${
                              step === s.id
                                ? "text-emerald-700"
                                : step > s.id
                                  ? "text-emerald-600"
                                  : "text-neutral-400"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div
                            className={`mx-2 mt-[-1rem] h-0.5 w-12 sm:w-20 ${
                              step > s.id ? "bg-emerald-400" : "bg-neutral-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-200">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-emerald-600">
                  {Math.round(progress)}% selesai
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-col px-6 pt-8 pb-6 sm:px-8">
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                <div className="flex-1">
                  {(() => {
                    if (step === 1) {
                      return (
                        <>
                          <div className="mb-8">
                            <h2 className="mb-1 text-xl font-bold text-neutral-900">
                              Detail Pribadi
                            </h2>
                            <p className="text-sm text-neutral-500">
                              Pengguna yang menambahkan nomor telepon dan email menerima
                              lebih banyak umpan balik positif dari perekrut.
                            </p>
                          </div>
                          <StepOneForm
                            formData={formData}
                            formErrors={formErrors}
                            handleChange={handleChange}
                          />
                        </>
                      );
                    } else if (step === 2) {
                      return (
                        <>
                          <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                              <h2 className="mb-1 text-xl font-bold text-neutral-900">
                                Pendidikan
                              </h2>
                              <p className="pr-10 text-sm text-neutral-500">
                                Bagikan riwayat pendidikanmu.
                              </p>
                            </div>

                            <div className="flex flex-col items-center">
                              <Switch
                                checked={useDefaultInputEdu}
                                onCheckedChange={setUseDefaultInputEdu}
                                className="cursor-pointer"
                              />
                              <span className="mt-1 w-17.5 whitespace-nowrap text-center text-[10px] text-neutral-500">
                                {useDefaultInputEdu ? "Input Default" : "Input Bebas"}
                              </span>
                            </div>
                          </div>

                          {useDefaultInputEdu ? (
                            <StepTwoForm
                              formData={formData}
                              formErrors={formErrors}
                              handleChange={handleChange}
                              addSectionItem={addSectionItem}
                              removeSectionItem={removeSectionItem}
                              openIndexes={openIndexesEdu}
                              setOpenIndexes={setOpenIndexesEdu}
                            />
                          ) : (
                            <StepTwoStory
                              formData={formData}
                              formErrors={formErrors}
                              handleChange={handleChange}
                              addSectionItem={addSectionItem}
                              removeSectionItem={removeSectionItem}
                              openIndexes={openIndexesEdu}
                              setOpenIndexes={setOpenIndexesEdu}
                            />
                          )}
                        </>
                      );
                    } else if (step === 3) {
                      return (
                        <>
                          <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                              <h2 className="mb-1 text-xl font-bold text-neutral-900">
                                Pengalaman Profesional
                              </h2>
                              <p className="pr-10 text-sm text-neutral-500">
                                Bagikan pengalaman kerja atau proyekmu. Kamu bisa
                                menulis secara bebas atau mengisi kolom terstruktur di
                                bawah.
                              </p>
                            </div>

                            <div className="flex flex-col items-center">
                              <Switch
                                checked={useDefaultInputWork}
                                onCheckedChange={setUseDefaultInputWork}
                                className="cursor-pointer"
                              />
                              <span className="mt-1 w-17.5 whitespace-nowrap text-center text-[10px] text-neutral-500">
                                {useDefaultInputWork ? "Input Default" : "Input Bebas"}
                              </span>
                            </div>
                          </div>

                          {useDefaultInputWork ? (
                            <StepThreeForm
                              formData={formData}
                              formErrors={formErrors}
                              handleChange={handleChange}
                              addSectionItem={addSectionItem}
                              removeSectionItem={removeSectionItem}
                              openIndexes={openIndexesWork}
                              setOpenIndexes={setOpenIndexesWork}
                            />
                          ) : (
                            <StepThreeStory
                              formData={formData}
                              formErrors={formErrors}
                              handleChange={handleChange}
                              addSectionItem={addSectionItem}
                              removeSectionItem={removeSectionItem}
                              openIndexes={openIndexesWork}
                              setOpenIndexes={setOpenIndexesWork}
                            />
                          )}
                        </>
                      );
                    } else if (step === 4) {
                      return (
                        <>
                          <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                              <h2 className="mb-1 text-xl font-bold text-neutral-900">
                                Pengalaman Organisasi{" "}
                                <span className="text-sm font-normal text-neutral-400">
                                  (Opsional)
                                </span>
                              </h2>
                              <p className="pr-10 text-sm text-neutral-500">
                                Bagikan pengalaman organisasimu. Kamu bisa menulis
                                secara bebas atau mengisi kolom terstruktur di bawah.
                              </p>
                            </div>

                            {!skipOrganizationExperience && (
                              <div className="flex flex-col items-center">
                                <Switch
                                  checked={useDefaultInputOrg}
                                  onCheckedChange={setUseDefaultInputOrg}
                                  className="cursor-pointer"
                                />
                                <span className="mt-1 w-17.5 whitespace-nowrap text-center text-[10px] text-neutral-500">
                                  {useDefaultInputOrg ? "Input Default" : "Input Bebas"}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mb-6 flex items-center gap-2">
                            <Checkbox
                              id="skipOrganization"
                              checked={skipOrganizationExperience}
                              onCheckedChange={(checked: boolean | "indeterminate") =>
                                setSkipOrganizationExperience(checked === true)
                              }
                            />
                            <Label
                              htmlFor="skipOrganization"
                              className="cursor-pointer text-sm font-normal text-neutral-500"
                            >
                              Lewati bagian ini
                            </Label>
                          </div>

                          {!skipOrganizationExperience && (
                            <>
                              {useDefaultInputOrg ? (
                                <StepFourForm
                                  formData={formData}
                                  formErrors={formErrors}
                                  handleChange={handleChange}
                                  addSectionItem={addSectionItem}
                                  removeSectionItem={removeSectionItem}
                                  openIndexes={openIndexesOrg}
                                  setOpenIndexes={setOpenIndexesOrg}
                                />
                              ) : (
                                <StepFourStory
                                  formData={formData}
                                  formErrors={formErrors}
                                  handleChange={handleChange}
                                  addSectionItem={addSectionItem}
                                  removeSectionItem={removeSectionItem}
                                  openIndexes={openIndexesOrg}
                                  setOpenIndexes={setOpenIndexesOrg}
                                />
                              )}
                            </>
                          )}
                        </>
                      );
                    }
                  })()}
                </div>

                <div className="mt-8 flex justify-between border-t border-neutral-100 pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Kembali
                    </Button>
                  )}
                  {step < 4 && (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto gap-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Lanjut
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  {step === 4 && (
                    <Button type="submit" className="ml-auto gap-1 bg-emerald-600 hover:bg-emerald-700">
                      <Send className="h-4 w-4" />
                      Kirim
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-4 border border-neutral-200">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
            <p className="text-neutral-700">
              Sedang membuat CV dengan AI...
            </p>
          </div>
        </div>
      )}

      {/* Error toast */}
      {submitError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg z-50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm">{submitError}</span>
            <button
              onClick={() => setSubmitError(null)}
              className="text-white/80 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Submit</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengirim semua data yang telah diisi?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubmitDialogOpen(false)}
            >
              Batal
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmSubmit}>
              Kirim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
