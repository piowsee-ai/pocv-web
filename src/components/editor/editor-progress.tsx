"use client";

import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Users,
  FolderKanban,
  Layers,
  FilePlus2,
} from "lucide-react";

export type EditorStep =
  | "personal"
  | "summary"
  | "education"
  | "work"
  | "organization"
  | "projects"
  | "additional"
  | "others";

interface StepConfig {
  id: EditorStep;
  label: string;
  icon: React.ElementType;
}

export const STEPS: StepConfig[] = [
  { id: "personal", label: "Data Pribadi", icon: User },
  { id: "summary", label: "Ringkasan", icon: FileText },
  { id: "education", label: "Pendidikan", icon: GraduationCap },
  { id: "work", label: "Profesional", icon: Briefcase },
  { id: "organization", label: "Organisasi", icon: Users },
  { id: "projects", label: "Proyek", icon: FolderKanban },
  { id: "additional", label: "Custom", icon: Layers },
  { id: "others", label: "Lainnya", icon: FilePlus2 },
];

export interface EditorProgressProps {
  currentStep: EditorStep;
  onStepChange: (step: EditorStep) => void;
  progress: number;
}

export function EditorProgress({
  currentStep,
  onStepChange,
  progress,
}: EditorProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-white border-b border-neutral-200 py-4 px-4 sm:px-6 @container">
      {/* Steps Container - Equal spacing using grid */}
      <div className="grid grid-cols-8 gap-0">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.id;
          const isPast = index < currentIndex;

          return (
            <div
              key={step.id}
              className="flex items-center justify-center relative"
            >
              {/* Connector Line Left */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute left-0 top-5 h-0.5 w-[calc(50%-20px)]",
                    index <= currentIndex ? "bg-emerald-400" : "bg-neutral-200"
                  )}
                />
              )}

              {/* Connector Line Right */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "absolute right-0 top-5 h-0.5 w-[calc(50%-20px)]",
                    index < currentIndex ? "bg-emerald-400" : "bg-neutral-200"
                  )}
                />
              )}

              {/* Step Circle */}
              <button
                onClick={() => onStepChange(step.id)}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-1 transition-all cursor-pointer",
                  "focus:outline-none rounded-lg p-1",
                  "group"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white",
                    isCurrent
                      ? "bg-emerald-600 text-white"
                      : isPast
                        ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 group-hover:text-emerald-800"
                        : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap transition-colors hidden @[600px]:block",
                    isCurrent
                      ? "text-emerald-700"
                      : isPast
                        ? "text-neutral-700 group-hover:text-neutral-900"
                        : "text-neutral-400 group-hover:text-neutral-600"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-neutral-500">
            Langkah {currentIndex + 1} dari {STEPS.length}
          </span>
          <span className="text-xs text-emerald-600 font-medium">
            {progress}% selesai
          </span>
        </div>
      </div>
    </div>
  );
}
