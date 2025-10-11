"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { StepOneForm } from "@/components/page-1/step-one-form";
import { StepTwoForm } from "@/components/page-1/step-two-form";
import { StepTwoStory } from "@/components/page-1/step-two-story";
import { WorkExperience } from "@/types/form-data";

export function WizardStep() {
  const [step, setStep] = useState(1);
  const [useDefaultInput, setUseDefaultInput] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    email: "",
    github: "",
    education: "",
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
    organization: "",
    softSkills: "",
    hardSkills: "",
    achievements: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleWorkExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const newWorkExperiences = [...formData.workExperiences];
    newWorkExperiences[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      workExperiences: newWorkExperiences,
    }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          city: "",
          description: "",
        },
      ],
    }));
  };

  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
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

      if (!formData.education) errors.education = "Pendidikan harus diisi.";
    }
    if (step === 2) {
      formData.workExperiences.forEach((exp, i) => {
        if (useDefaultInput) {
          if (!exp.position) errors[`position-${i}`] = `Jabatan harus diisi.`;
          if (!exp.company) errors[`company-${i}`] = `Perusahaan harus diisi.`;
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
    if (validateStep()) {
      const finalWorkExperiences = useDefaultInput
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

      const finalData = {
        ...formData,
        workExperiences: finalWorkExperiences,
      };

      // TODO: send "finalData" to backend
    }
  };

  const progress = step === 1 ? 0 : 50;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl [box-shadow:0_0_30px_5px_rgba(0,0,0,0.10)] dark:bg-neutral-800 overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-4 pb-2">
        <div className="w-12 h-6 flex items-center justify-center px-2 py-0.5 bg-[#EFA0A0] text-black-700 text-sm font-semibold rounded-md">
          {Math.round(progress)}%
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Progres pengisian resume awalmu
        </p>
      </div>

      <Progress
        value={progress}
        className="h-0.75 mt-1.5 rounded-none [&>div]:bg-[#EFA0A0]"
      />

      <div className="px-10 py-6">
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                Detail Pribadi
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                Pengguna yang menambahkan nomor telepon dan email menerima lebih
                banyak umpan balik positif dari perekrut.
              </p>
              <StepOneForm
                formData={formData}
                formErrors={formErrors}
                handleChange={handleChange}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                    Pengalaman Profesional
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Bagikan pengalaman kerja atau proyekmu. Kamu bisa menulis
                    secara bebas atau mengisi kolom terstruktur di bawah.
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Switch
                    checked={useDefaultInput}
                    onCheckedChange={setUseDefaultInput}
                  />
                  {useDefaultInput ? (
                    <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap">
                      Input Default
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-1 whitespace-nowrap">
                      Input Bebas
                    </span>
                  )}
                </div>
              </div>

              {useDefaultInput ? (
                <StepTwoForm
                  formData={formData}
                  formErrors={formErrors}
                  handleWorkExperienceChange={handleWorkExperienceChange}
                  addWorkExperience={addWorkExperience}
                  removeWorkExperience={removeWorkExperience}
                />
              ) : (
                <StepTwoStory
                  formData={formData}
                  formErrors={formErrors}
                  handleWorkExperienceChange={handleWorkExperienceChange}
                  addWorkExperience={addWorkExperience}
                  removeWorkExperience={removeWorkExperience}
                />
              )}
            </>
          )}

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
            {step < 2 && (
              <Button
                type="button"
                onClick={nextStep}
                variant="green"
                className="ml-auto w-[96px]"
              >
                Lanjut
              </Button>
            )}
            {step === 2 && (
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
    </div>
  );
}
