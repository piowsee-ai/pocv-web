"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Eye, Edit3, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  viewMode: "edit" | "preview";
  onViewModeChange: (mode: "edit" | "preview") => void;
  onDownload: () => void;
  isDownloading?: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
}

export function EditorHeader({
  viewMode,
  onViewModeChange,
  onDownload,
  isDownloading,
  saveStatus,
  onSave,
}: EditorHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-neutral-200 shadow-sm flex-shrink-0 @container">
      <div className="h-full flex items-center justify-between px-3 @[500px]:px-6">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/logo-beta.png"
            alt="Logo"
            width={28}
            height={28}
            priority
          />
          <span className="text-lg font-bold hidden @[500px]:inline">pocv</span>
        </Link>

        {/* Center - Tabs (hidden on small containers) */}
        <div className="hidden @[700px]:flex absolute left-1/2 -translate-x-1/2 items-center bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("edit")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
              viewMode === "edit"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            )}
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onViewModeChange("preview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
              viewMode === "preview"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            )}
          >
            <Eye className="w-4 h-4" />
            Full Preview
          </button>
        </div>

        {/* Right - Save Status + Download */}
        <div className="flex items-center gap-2 @[500px]:gap-3">
          {/* Save Status Indicator - hide on mobile */}
          <div className="hidden @[500px]:flex items-center gap-1.5 text-sm">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                <span className="text-neutral-500">Menyimpan...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Tersimpan</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-500">Gagal</span>
              </>
            )}
          </div>

          {/* Download Button - always show with text */}
          <Button
            onClick={onDownload}
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-4"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengunduh...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
