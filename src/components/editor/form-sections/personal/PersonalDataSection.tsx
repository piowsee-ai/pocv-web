"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/location-input";
import { EditableSectionHeader } from "../../ui/editable-section-header";
import type { FormSectionProps } from "../common/types";

// Personal Data Section - Tips for recruiting
const PERSONAL_DATA_TIPS = [
  "Gunakan nama yang profesional, hindari nickname",
  "Gunakan email profesional, hindari email dengan nama lucu",
  "Cukup tulis kota dan negara. Alamat lengkap tidak diperlukan",
  "90% recruiter akan cek LinkedIn-mu. Pastikan profilmu sudah lengkap",
];

// Personal Data Section
export function PersonalDataSection({ data, setData }: FormSectionProps) {
  const updatePersonalData = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personalData: { ...prev.personalData, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <EditableSectionHeader
        title="Personal Data"
        tips={PERSONAL_DATA_TIPS}
      />

      <div className="grid grid-cols-1 @md:grid-cols-2 gap-5">
        <div className="space-y-2 @md:col-span-2">
          <Label>Nama Lengkap</Label>
          <Input
            value={data.personalData.name}
            onChange={(e) => updatePersonalData("name", e.target.value)}
            placeholder="John Doe"
            className="text-base text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={data.personalData.email}
            onChange={(e) => updatePersonalData("email", e.target.value)}
            placeholder="john@example.com"
            className="text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label>No. Telepon</Label>
          <PhoneInput
            id="phone"
            value={data.personalData.phone}
            onChange={(e) => updatePersonalData("phone", e.target.value)}
          />
        </div>

        <div className="space-y-2 @md:col-span-2">
          <Label>Lokasi</Label>
          <LocationInput
            value={data.personalData.location}
            onChange={(e) => updatePersonalData("location", e.target.value)}
            placeholder="Pilih lokasi"
          />
        </div>

        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input
            value={data.personalData.linkedin}
            onChange={(e) => updatePersonalData("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            className="text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input
            value={data.personalData.github}
            onChange={(e) => updatePersonalData("github", e.target.value)}
            placeholder="github.com/johndoe"
            className="text-neutral-900"
          />
        </div>

        <div className="space-y-2 @md:col-span-2">
          <Label>Website / Portfolio</Label>
          <Input
            value={data.personalData.website}
            onChange={(e) => updatePersonalData("website", e.target.value)}
            placeholder="https://johndoe.dev"
            className="text-neutral-900"
          />
        </div>
      </div>
    </div>
  );
}
