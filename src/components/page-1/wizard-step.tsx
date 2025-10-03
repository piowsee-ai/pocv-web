"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function WizardStep() {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    email: "",
    github: "",
    education: "",
    workExperience: "",
    organization: "",
    softSkills: "",
    hardSkills: "",
    achievements: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Hapus state error saat user mulai isi field
    setFormErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field yg wajib diisi
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Nama Lengkap harus diisi.";
    if (!formData.phone) errors.phone = "Nomor Telepon harus diisi.";
    if (!formData.education) errors.education = "Pendidikan harus diisi.";
    if (!formData.workExperience) errors.workExperience = "Pengalaman Kerja harus diisi.";

    setFormErrors(errors);

    // jika gak ada error, submit data
    if (Object.keys(errors).length === 0) {
      alert("Form submitted successfully!");
      // nanti tambah route tujuan
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-neutral-800">
      <h2 className="text-xl font-semibold mb-4">Lengkapi Profil Anda</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Nama */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nama Lengkap
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            required
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
          )}
        </div>

        {/* Telepon */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Telepon
          </label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nomor HP, contoh: 081234567890"
            required
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div className="mb-4">
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            LinkedIn (Opsional)
          </label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="Tautan LinkedIn"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email (Opsional)
          </label>
          <Input
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Alamat Email"
          />
        </div>

        {/* Github */}
        <div className="mb-4">
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Github (Opsional)
          </label>
          <Input
            id="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="Tautan Github"
          />
        </div>

        {/* Pendidikan */}
        <div className="mb-4">
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pendidikan
          </label>
          <Textarea
            id="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="Nama Institusi, Daerah, MM/YYYY - MM/YYYY, Jurusan/Gelar, Deskripsi"
            required
          />
          {formErrors.education && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.education}</p>
          )}
        </div>

        {/* Pengalaman Kerja */}
        <div className="mb-4">
          <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pengalaman Kerja
          </label>
          <Textarea
            id="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            placeholder="Posisi di Perusahaan, MM/YYYY - MM/YYYY, Deskripsi"
            required
          />
          {formErrors.workExperience && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.workExperience}</p>
          )}
        </div>

        {/* Organisasi */}
        <div className="mb-4">
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organisasi (Opsional)
          </label>
          <Textarea
            id="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Posisi di Organisasi, MM/YYYY - MM/YYYY, Deskripsi"
          />
        </div>

        {/* Softskills */}
        <div className="mb-4">
          <label htmlFor="softSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Softskills (Opsional)
          </label>
          <Input
            id="softSkills"
            value={formData.softSkills}
            onChange={handleChange}
            placeholder="Contoh: Komunikasi, Public Speaking, Kepemimpinan"
          />
        </div>

        {/* Hardskills */}
        <div className="mb-4">
          <label htmlFor="hardSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hardskills (Opsional)
          </label>
          <Input
            id="hardSkills"
            value={formData.hardSkills}
            onChange={handleChange}
            placeholder="Contoh: Legal Writing, Microsoft Office, Legal Research"
          />
        </div>

        {/* Prestasi */}
        <div className="mb-4">
          <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prestasi (Opsional)
          </label>
          <Textarea
            id="achievements"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="Judul, Tahun. Contoh: Juara 1 Kompetisi Debat Hukum Nasional, 2023"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-4 px-4 py-2 text-center bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}