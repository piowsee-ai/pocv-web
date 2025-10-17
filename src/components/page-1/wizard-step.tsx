"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

import { StepOneForm } from "@/components/page-1/step-one/form";
import { StepTwoForm } from "@/components/page-1/step-two/form";
import { StepTwoStory } from "@/components/page-1/step-two/story";
import { StepThreeForm } from "@/components/page-1/step-three/form";
import { StepThreeStory } from "@/components/page-1/step-three/story";
import { StepFourForm } from "@/components/page-1/step-four/form";
import { StepFourStory } from "@/components/page-1/step-four/story";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function WizardStep() {
  const [step, setStep] = useState(1);
  const [useDefaultInputEdu, setUseDefaultInputEdu] = useState(true);
  const [useDefaultInputWork, setUseDefaultInputWork] = useState(true);
  const [useDefaultInputOrg, setUseDefaultInputOrg] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    email: "",
    github: "",
    educations: [
      {
        degree: "",
        major: "",
        institution: "",
        startDate: "",
        endDate: "",
        location: "",
        gpa: "",
        description: "",
      },
    ],
    workExperiences: [
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        city: "",
        description: "",
      },
    ],
    organizationExperiences: [
      {
        position: "",
        organization: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
      },
    ],
  });

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  type SectionType =
    | "educations"
    | "workExperiences"
    | "organizationExperiences"
    | "root";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: SectionType = "root",
    index?: number
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      if (section === "root") {
        return { ...prev, [id]: value };
      }

      const updatedArray = [...prev[section]];
      if (index !== undefined) {
        updatedArray[index] = { ...updatedArray[index], [id]: value };
      }

      return { ...prev, [section]: updatedArray };
    });

    setFormErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  type ArraySection = Exclude<SectionType, "root">;

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
          description: "",
        };
      case "workExperiences":
        return {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          city: "",
          description: "",
        };
      case "organizationExperiences":
        return {
          position: "",
          organization: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
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
      if (!formData.name) errors.name = "Nama Lengkap harus diisi.";

      if (!formData.phone) {
        errors.phone = "Nomor Telepon harus diisi.";
      } else if (!/^\d{10,15}$/.test(formData.phone)) {
        errors.phone = "Nomor Telepon harus berupa 10-15 digit angka.";
      }

      if (!formData.email) {
        errors.email = "Alamat Email harus diisi.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Format email tidak valid.";
      }

      if (!formData.educations) errors.education = "Pendidikan harus diisi.";
    }
    if (step === 2) {
      formData.educations.forEach((exp, i) => {
        if (useDefaultInputEdu) {
          if (!exp.degree) errors[`degree-${i}`] = `Gelar harus diisi.`;
          if (!exp.major) errors[`company-${i}`] = `Program Studi harus diisi.`;
          if (!exp.institution)
            errors[`company-${i}`] = `Institusi harus diisi.`;
        }
        if (!exp.description)
          errors[`description-${i}`] = `Deskripsi harus diisi.`;
      });
    }
    if (step === 3) {
      formData.workExperiences.forEach((exp, i) => {
        if (useDefaultInputWork) {
          if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
          if (!exp.company) errors[`company-${i}`] = `Perusahaan harus diisi.`;
        }

        if (!exp.description)
          errors[`description-${i}`] = `Deskripsi harus diisi.`;
      });
    }

    if (step === 4) {
      formData.organizationExperiences.forEach((exp, i) => {
        if (useDefaultInputOrg) {
          if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
          if (!exp.organization)
            errors[`organization-${i}`] = `Nama organisasi harus diisi.`;
        }

        if (!exp.description)
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

  const handleConfirmSubmit = () => {
    setSubmitDialogOpen(false);
    const finalWorkExperiences = useDefaultInputWork
      ? formData.workExperiences.map((exp) => ({
          position: exp.position,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          city: exp.city,
          description: exp.description,
        }))
      : formData.workExperiences.map((exp) => ({
          description: exp.description,
        }));

    const finaleducations = useDefaultInputEdu
      ? formData.educations.map((exp) => ({
          degree: exp.degree,
          major: exp.major,
          institution: exp.institution,
          startDate: exp.startDate,
          endDate: exp.endDate,
          location: exp.location,
          gpa: exp.gpa,
          description: exp.description,
        }))
      : formData.educations.map((exp) => ({
          description: exp.description,
        }));

    const finalOrganizationExperiences = useDefaultInputOrg
      ? formData.organizationExperiences.map((exp) => ({
          position: exp.position,
          organization: exp.organization,
          startDate: exp.startDate,
          endDate: exp.endDate,
          location: exp.location,
          description: exp.description,
        }))
      : formData.workExperiences.map((exp) => ({
          description: exp.description,
        }));

    const finalData = {
      ...formData,
      workExperiences: finalWorkExperiences,
      educations: finaleducations,
      organizationExperiences: finalOrganizationExperiences,
    };
    console.log(finalData);
    // TODO: send data to backend
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
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap w-[70px] text-center">
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
                    />
                  ) : (
                    <StepTwoStory
                      formData={formData}
                      formErrors={formErrors}
                      handleChange={handleChange}
                      addSectionItem={addSectionItem}
                      removeSectionItem={removeSectionItem}
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
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap w-[70px] text-center">
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
                    />
                  ) : (
                    <StepThreeStory
                      formData={formData}
                      formErrors={formErrors}
                      handleChange={handleChange}
                      addSectionItem={addSectionItem}
                      removeSectionItem={removeSectionItem}
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
                        Pengalaman Organisasi
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 pr-10">
                        Bagikan pengalaman organisasimu. Kamu bisa menulis
                        secara bebas atau mengisi kolom terstruktur di bawah.
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Switch
                        checked={useDefaultInputOrg}
                        onCheckedChange={setUseDefaultInputOrg}
                        className="cursor-pointer"
                      />
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap w-[70px] text-center">
                        {useDefaultInputOrg ? "Input Default" : "Input Bebas"}
                      </span>
                    </div>
                  </div>

                  {useDefaultInputOrg ? (
                    <StepFourForm
                      formData={formData}
                      formErrors={formErrors}
                      handleChange={handleChange}
                      addSectionItem={addSectionItem}
                      removeSectionItem={removeSectionItem}
                    />
                  ) : (
                    <StepFourStory
                      formData={formData}
                      formErrors={formErrors}
                      handleChange={handleChange}
                      addSectionItem={addSectionItem}
                      removeSectionItem={removeSectionItem}
                    />
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
                className="w-[96px]"
              >
                Kembali
              </Button>
            )}
            {step < 4 && (
              <Button
                type="button"
                onClick={nextStep}
                variant="green"
                className="ml-auto w-[96px]"
              >
                Lanjut
              </Button>
            )}
            {step === 4 && (
              <Button
                type="submit"
                variant="green"
                className="ml-auto w-[96px]"
              >
                Kirim
              </Button>
            )}
          </div>
        </form>
      </div>
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
