import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form-data";

interface StepOneProps {
  formData: FormData;
  formErrors: Record<string, string>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

function StepOneForm({ formData, formErrors, handleChange }: StepOneProps) {
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="name" className="mb-1 block">
          Nama Lengkap <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nama Lengkap"
          required
          className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {formErrors.name}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="phone" className="mb-1 block">
          Telepon <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nomor HP, contoh: 081234567890"
          required
          className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {formErrors.phone && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {formErrors.phone}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="email" className="mb-1 block">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Alamat Email"
          required
          className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {formErrors.email}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="linkedin" className="mb-1 block">
          LinkedIn (Opsional)
        </Label>
        <Input
          id="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="Tautan LinkedIn"
          className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="github" className="mb-1 block">
          Portofolio (Opsional)
        </Label>
        <Input
          id="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="Tautan Portofolio"
          className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="education" className="mb-1 block">
          Pendidikan <span className="text-red-500">*</span>
        </Label>
        <TextArea
          id="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="Nama Institusi, Daerah, MM/YYYY - MM/YYYY, Jurusan/Gelar, Deskripsi"
          required
          className="bg-[#E9E9E9] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {formErrors.education && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {formErrors.education}
          </p>
        )}
      </div>
    </>
  );
}

export { StepOneForm };
