"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { EditableSectionHeader } from "../../ui/editable-section-header";
import type { FormSectionProps } from "../common/types";

// Summary Section - Tips
const SUMMARY_TIPS = [
  "Recruiter hanya baca 6 detik. Tulis yang paling relevan dengan posisi yang kamu lamar",
  "Gunakan 2-4 kalimat singkat dan padat",
  "Sebutkan tahun pengalaman dan spesialisasi utama",
];

// Summary Section
export function SummarySection({ data, setData }: FormSectionProps) {
  const updateSectionTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      sectionTitles: { ...prev.sectionTitles, summary: title },
    }));
  };

  return (
    <div className="space-y-6">
      <EditableSectionHeader
        title={data.sectionTitles?.summary || "Summary"}
        defaultTitle="Summary"
        onTitleChange={updateSectionTitle}
        tips={SUMMARY_TIPS}
      />

      <div className="space-y-2">
        <Label>Ringkasan</Label>
        <RichTextEditor
          value={data.summary}
          onChange={(value: string) => setData((prev) => ({ ...prev, summary: value }))}
          placeholder="Contoh: Saya adalah seorang software engineer dengan pengalaman 3 tahun di bidang web development..."
          showListButtons={false}
          minHeight={120}
        />
      </div>
    </div>
  );
}
