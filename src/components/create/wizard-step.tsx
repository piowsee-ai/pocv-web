"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

import { StepOneForm } from "@/components/create/step-one/form";
import { StepTwoForm } from "@/components/create/step-two/form";
import { StepTwoStory } from "@/components/create/step-two/story";
import { StepThreeForm } from "@/components/create/step-three/form";
import { StepThreeStory } from "@/components/create/step-three/story";
import { StepFourForm } from "@/components/create/step-four/form";
import { StepFourStory } from "@/components/create/step-four/story";

import type { FormData } from "@/types/form-data";

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

  const progress = (100 / 4) * (step - 1);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl [box-shadow:0_0_30px_5px_rgba(0,0,0,0.10)] dark:bg-neutral-800 overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-4 pb-2">
        <div className="w-12 h-6 flex items-center justify-center px-2 py-0.5 bg-rose-300 text-black-700 text-sm font-semibold rounded-md">
          {Math.round(progress)}%
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Progress pengisian resume awalmu
        </p>
      </div>

      <Progress
        value={progress}
        className="h-0.75 mt-1.5 rounded-none [&>div]:bg-rose-300"
      />

      <div className="px-10 py-6">
        <form onSubmit={handleSubmit}>
          {(() => {
            if (step === 1) {
              return (
                <>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                    Detail Pribadi
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                    Pengguna yang menambahkan nomor telepon dan email menerima
                    lebih banyak umpan balik positif dari perekrut.
                  </p>
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                        Pendidikan
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 pr-10">
                        Bagikan riwayat pendidikanmu.
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Switch
                        checked={useDefaultInputEdu}
                        onCheckedChange={setUseDefaultInputEdu}
                        className="cursor-pointer"
                      />
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap w-17.5 text-center">
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                        Pengalaman Profesional
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 pr-10">
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
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap w-17.5 text-center">
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                        Pengalaman Organisasi{" "}
                        <span className="text-sm font-normal text-neutral-500">
                          (Opsional)
                        </span>
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 pr-10">
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
                        <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap w-17.5 text-center">
                          {useDefaultInputOrg ? "Input Default" : "Input Bebas"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                      id="skipOrganization"
                      checked={skipOrganizationExperience}
                      onCheckedChange={(checked) =>
                        setSkipOrganizationExperience(checked === true)
                      }
                    />
                    <Label
                      htmlFor="skipOrganization"
                      className="text-sm font-normal text-neutral-600 dark:text-neutral-300 cursor-pointer"
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

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="green"
                className="w-24"
              >
                Kembali
              </Button>
            )}
            {step < 4 && (
              <Button
                type="button"
                onClick={nextStep}
                variant="green"
                className="ml-auto w-24"
              >
                Lanjut
              </Button>
            )}
            {step === 4 && (
              <Button type="submit" variant="green" className="ml-auto w-24">
                Kirim
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* TODO: add loading library */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-neutral-700 dark:text-neutral-300">
              Sedang membuat CV dengan AI...
            </p>
          </div>
        </div>
      )}

      {/* TODO: add error component; fix button style */}
      {submitError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50">
          <div className="flex items-center gap-2">
            <span>{submitError}</span>
            <Button
              onClick={() => setSubmitError(null)}
              variant="ghost"
              size="sm"
              className="text-red-700 hover:text-red-900 h-auto p-0"
            >
              ✕
            </Button>
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
            <Button variant="destructive" onClick={handleConfirmSubmit}>
              Kirim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
