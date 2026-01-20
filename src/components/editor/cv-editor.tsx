"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormData } from "@/types/form-data";
import { Button } from "@/components/ui/button";

interface CVEditorProps {
  cvId: string;
  initialData: FormData;
}

export function CVEditor({ cvId, initialData }: CVEditorProps) {
  const router = useRouter();
  const [data, setData] = useState<FormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/cv/${cvId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save CV");
      }

      // TODO: Show success toast
    } catch (error) {
      console.error("Error saving CV:", error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg dark:bg-neutral-800 overflow-hidden">
      <div className="px-8 py-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              CV Editor
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Edit dan sesuaikan CV-mu
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Kembali
            </Button>
            <Button
              variant="green"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Personal Data Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Data Pribadi
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Nama
              </label>
              <input
                type="text"
                value={data.personalData.name}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    personalData: { ...prev.personalData, name: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={data.personalData.email}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    personalData: { ...prev.personalData, email: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Telepon
              </label>
              <input
                type="tel"
                value={data.personalData.phone}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    personalData: { ...prev.personalData, phone: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={data.personalData.location}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    personalData: { ...prev.personalData, location: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Ringkasan
          </h2>
          <textarea
            value={data.summary}
            onChange={(e) =>
              setData((prev) => ({ ...prev, summary: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          />
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Pendidikan ({data.educations.length})
          </h2>
          {data.educations.map((edu, index) => (
            <div
              key={edu.id || index}
              className="p-4 mb-4 border border-neutral-200 rounded-lg dark:border-neutral-600"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  value={edu.institution}
                  placeholder="Institusi"
                  onChange={(e) => {
                    const updated = [...data.educations];
                    updated[index] = { ...updated[index], institution: e.target.value };
                    setData((prev) => ({ ...prev, educations: updated }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="text"
                  value={edu.degree}
                  placeholder="Gelar"
                  onChange={(e) => {
                    const updated = [...data.educations];
                    updated[index] = { ...updated[index], degree: e.target.value };
                    setData((prev) => ({ ...prev, educations: updated }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {edu.major} • {edu.startDate} - {edu.endDate}
              </div>
            </div>
          ))}
        </section>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Pengalaman Kerja ({data.workExperiences.length})
          </h2>
          {data.workExperiences.map((work, index) => (
            <div
              key={work.id || index}
              className="p-4 mb-4 border border-neutral-200 rounded-lg dark:border-neutral-600"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  value={work.position}
                  placeholder="Posisi"
                  onChange={(e) => {
                    const updated = [...data.workExperiences];
                    updated[index] = { ...updated[index], position: e.target.value };
                    setData((prev) => ({ ...prev, workExperiences: updated }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="text"
                  value={work.company}
                  placeholder="Perusahaan"
                  onChange={(e) => {
                    const updated = [...data.workExperiences];
                    updated[index] = { ...updated[index], company: e.target.value };
                    setData((prev) => ({ ...prev, workExperiences: updated }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {work.location} • {work.startDate} - {work.endDate}
              </div>
              <ul className="mt-2 list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300">
                {work.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Organization Experience Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Pengalaman Organisasi ({data.organizationExperiences.length})
          </h2>
          {data.organizationExperiences.map((org, index) => (
            <div
              key={org.id || index}
              className="p-4 mb-4 border border-neutral-200 rounded-lg dark:border-neutral-600"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  value={org.position}
                  placeholder="Posisi"
                  onChange={(e) => {
                    const updated = [...data.organizationExperiences];
                    updated[index] = { ...updated[index], position: e.target.value };
                    setData((prev) => ({ ...prev, organizationExperiences: updated }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
                <input
                  type="text"
                  value={org.organization}
                  placeholder="Organisasi"
                  onChange={(e) => {
                    const updated = [...data.organizationExperiences];
                    updated[index] = { ...updated[index], organization: e.target.value };
                    setData((prev) => ({ ...prev, organizationExperiences: updated }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {org.startDate} - {org.endDate}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
