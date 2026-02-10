"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye, Edit3, Loader2, Check, AlertCircle, Save, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  viewMode: "edit" | "preview";
  onViewModeChange: (mode: "edit" | "preview") => void;
  onDownload: () => void;
  isDownloading?: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
  hasUnsavedChanges?: boolean;
}

export function EditorHeader({
  viewMode,
  onViewModeChange,
  onDownload,
  isDownloading,
  saveStatus,
  onSave,
  hasUnsavedChanges = false,
}: EditorHeaderProps) {
  const isSaving = saveStatus === "saving";
  const [showExitDialog, setShowExitDialog] = useState(false);
  const router = useRouter();

  const handleExit = () => {
    setShowExitDialog(true);
  };

  return (
    <header className="h-14 bg-white border-b border-neutral-200 shadow-sm flex-shrink-0 @container">
      <div className="h-full flex items-center justify-between px-3 @[500px]:px-6">
        {/* Left - Logo */}
        {/* Left - Back to Dashboard */}
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 shrink-0 text-neutral-600 hover:text-neutral-900 transition-colors group"
        >
          <div className="p-1 rounded-full group-hover:bg-neutral-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm hidden @[400px]:inline">Dashboard</span>
        </button>

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
            Tampilan penuh
          </button>
        </div>

        {/* Right - Save Status + Save Button + Download */}
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

          {/* Manual Save Button - enabled when has unsaved changes, disabled during saving */}
          <Button
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            variant="outline"
            className={cn(
              "gap-2 px-3 transition-all",
              hasUnsavedChanges && !isSaving
                ? "border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700"
                : "text-neutral-400"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden @[500px]:inline">Simpan</span>
          </Button>

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

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keluar ke Dashboard?</DialogTitle>
            <DialogDescription>
              {hasUnsavedChanges
                ? "Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?"
                : "Yakin ingin kembali ke dashboard?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Batal
            </Button>
            <Button onClick={() => router.push("/")} className="bg-emerald-600 hover:bg-emerald-700">
              Ya, Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
