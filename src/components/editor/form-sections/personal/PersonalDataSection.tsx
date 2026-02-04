"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/ui/location-input";
import { EditableSectionHeader } from "../../ui/editable-section-header";
import type { FormSectionProps } from "../common/types";
import {
  MAX_LENGTH,
  sanitizeName,
  sanitizePhone,
  truncateToMaxLength,
} from "@/lib/validation/editor-validation";
import { useValidationToast } from "@/components/ui/validation-toast";

// Personal Data Section - Tips for recruiting
const PERSONAL_DATA_TIPS = [
  "Gunakan nama yang profesional, hindari nickname",
  "Gunakan email profesional, hindari email dengan nama lucu",
  "Cukup tulis kota dan negara. Alamat lengkap tidak diperlukan",
  "90% recruiter akan cek LinkedIn-mu. Pastikan profilmu sudah lengkap",
];

// Personal Data Section
export function PersonalDataSection({ data, setData }: FormSectionProps) {
  const { showValidationError } = useValidationToast();

  const updatePersonalData = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personalData: { ...prev.personalData, [field]: value },
    }));
  };

  // Sanitized handlers for name and phone with toast notifications
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.value;
    const sanitized = sanitizeName(original);
    const truncated = truncateToMaxLength(sanitized, MAX_LENGTH.NAME);

    // Show toast if characters were blocked - find the blocked char
    if (original !== sanitized) {
      const blockedChar = original.split('').find(c => !sanitized.includes(c) && !/[\p{L}\s\-'.]/u.test(c));
      showValidationError("tidak diperbolehkan. Nama hanya boleh mengandung huruf, spasi, titik, atau tanda hubung", blockedChar);
    }

    updatePersonalData("name", truncated);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const original = e.target.value;
    const sanitized = sanitizePhone(original);
    const truncated = truncateToMaxLength(sanitized, MAX_LENGTH.PHONE);

    // Show toast if characters were blocked
    if (original !== sanitized) {
      showValidationError("Nomor telepon hanya boleh mengandung angka, +, -, spasi, atau kurung");
    }

    updatePersonalData("phone", truncated);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const truncated = truncateToMaxLength(e.target.value, MAX_LENGTH.LOCATION);
    updatePersonalData("location", truncated);
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
            onChange={handleNameChange}
            placeholder="John Doe"
            maxLength={MAX_LENGTH.NAME}
            className="text-base text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={data.personalData.email}
            onChange={(e) => updatePersonalData("email", truncateToMaxLength(e.target.value, MAX_LENGTH.EMAIL))}
            placeholder="john@example.com"
            maxLength={MAX_LENGTH.EMAIL}
            className="text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label>No. Telepon</Label>
          <div
            onKeyDownCapture={(e) => {
              // Only validate for input elements
              if ((e.target as HTMLElement).tagName !== "INPUT") return;

              // Control keys allowed
              const controlKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "Home", "End"];
              if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;

              // Check if valid phone key
              const validPhoneKeys = /^[0-9+\-\s()]+$/;
              if (!validPhoneKeys.test(e.key)) {
                e.preventDefault();
                showValidationError("tidak diperbolehkan. Nomor telepon hanya boleh mengandung angka", e.key);
              }
            }}
          >
            <PhoneInput
              id="phone"
              value={data.personalData.phone}
              onChange={handlePhoneChange}
            />
          </div>
        </div>

        <div className="space-y-2 @md:col-span-2">
          <Label>Lokasi</Label>
          <LocationInput
            value={data.personalData.location}
            onChange={handleLocationChange}
            placeholder="Pilih lokasi"
          />
        </div>

        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input
            value={data.personalData.linkedin}
            onChange={(e) => updatePersonalData("linkedin", truncateToMaxLength(e.target.value, MAX_LENGTH.URL))}
            placeholder="linkedin.com/in/johndoe"
            maxLength={MAX_LENGTH.URL}
            className="text-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input
            value={data.personalData.github}
            onChange={(e) => updatePersonalData("github", truncateToMaxLength(e.target.value, MAX_LENGTH.URL))}
            placeholder="github.com/johndoe"
            maxLength={MAX_LENGTH.URL}
            className="text-neutral-900"
          />
        </div>

        <div className="space-y-2 @md:col-span-2">
          <Label>Website / Portfolio</Label>
          <Input
            value={data.personalData.website}
            onChange={(e) => updatePersonalData("website", truncateToMaxLength(e.target.value, MAX_LENGTH.URL))}
            placeholder="https://johndoe.dev"
            maxLength={MAX_LENGTH.URL}
            className="text-neutral-900"
          />
        </div>
      </div>
    </div>
  );
}
