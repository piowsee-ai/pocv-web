import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import type { FormData } from "@/types/form-data";


interface StepOneFormProps {
  formData: FormData;
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
}

export function StepOneForm({
  formData,
  formErrors,
  handleChange,
}: StepOneFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nama Lengkap <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.personalData.name}
          onChange={handleChange}
          placeholder="Nama Lengkap"
          required
          className="text-neutral-900"
        />
        {formErrors.name && (
          <p className="text-sm text-red-500">{formErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Telepon <span className="text-red-500">*</span>
        </Label>
        <PhoneInput
          id="phone"
          value={formData.personalData.phone}
          onChange={handleChange}
          placeholder="6281234567890"
          required
        />
        {formErrors.phone && (
          <p className="text-sm text-red-500">{formErrors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          value={formData.personalData.email}
          onChange={handleChange}
          placeholder="Alamat Email"
          required
          className="text-neutral-900"
        />
        {formErrors.email && (
          <p className="text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn (Opsional)</Label>
        <Input
          id="linkedin"
          value={formData.personalData.linkedin}
          onChange={handleChange}
          placeholder="Tautan LinkedIn"
          className="text-neutral-900"
        />
        {formErrors.linkedin && (
          <p className="text-sm text-red-500">{formErrors.linkedin}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">Github (Opsional)</Label>
        <Input
          id="github"
          value={formData.personalData.github}
          onChange={handleChange}
          placeholder="Tautan Github"
          className="text-neutral-900"
        />
        {formErrors.github && (
          <p className="text-sm text-red-500">{formErrors.github}</p>
        )}
      </div>
    </div>
  );
}
