"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { FormData } from "@/types/editor-form-data";
import { Button } from "@/components/ui/button";
import { EditorHeader } from "./editor-header";
import { EditorProgress, type EditorStep, STEPS } from "./editor-progress";
import { STEP_COMPONENTS } from "./form-sections";
import { CVPreview } from "./cv-preview";
import { AutoScalePreview } from "./ui/auto-scale-preview";
import { ChevronLeft, ChevronRight, Loader2, Check, Eye, GripVertical } from "lucide-react";

interface CVEditorProps {
  cvId: string;
  initialData: FormData;
}

// Helper: Convert description array to HTML
function descriptionToHtml(description: string | string[] | undefined): string {
  if (!description) return "";
  const arr = Array.isArray(description) ? description : [description];
  if (arr.length === 0) return "";
  // Convert to bullet list HTML
  return `<ul>${arr.filter(d => d.trim()).map(d => `<li>${d}</li>`).join("")}</ul>`;
}

// Helper: Normalize date format from various LLM formats to YYYY-MM
function normalizeDateFormat(dateStr: string | undefined): string {
  if (!dateStr) return "";

  // Check for "Present" or "Sekarang" - keep as empty to use isCurrent flag
  if (/present|sekarang|current|now/i.test(dateStr)) {
    return "";
  }

  // Already in YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Format: MM/YYYY or M/YYYY
  const mmYyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{4})/);
  if (mmYyyyMatch) {
    const month = mmYyyyMatch[1].padStart(2, "0");
    const year = mmYyyyMatch[2];
    return `${year}-${month}`;
  }

  // Format: YYYY-MM-DD
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}`;
  }

  // Format with text like "08/2027 (Expected)" - extract date part
  const withTextMatch = dateStr.match(/(\d{1,2})\/(\d{4})/);
  if (withTextMatch) {
    const month = withTextMatch[1].padStart(2, "0");
    const year = withTextMatch[2];
    return `${year}-${month}`;
  }

  // Try to parse month name format like "August 2027" or "Aug 2027"
  const monthNames: { [key: string]: string } = {
    january: "01", jan: "01", februari: "02", february: "02", feb: "02",
    march: "03", mar: "03", maret: "03", april: "04", apr: "04",
    may: "05", mei: "05", june: "06", jun: "06", juni: "06",
    july: "07", jul: "07", juli: "07", august: "08", aug: "08", agustus: "08",
    september: "09", sep: "09", october: "10", oct: "10", oktober: "10",
    november: "11", nov: "11", december: "12", dec: "12", desember: "12"
  };
  const monthYearMatch = dateStr.toLowerCase().match(/([a-z]+)\s*(\d{4})/);
  if (monthYearMatch && monthNames[monthYearMatch[1]]) {
    return `${monthYearMatch[2]}-${monthNames[monthYearMatch[1]]}`;
  }

  // Return original if can't parse
  return dateStr;
}

// Helper: Normalize degree value to match DEGREE_OPTIONS values
function normalizeDegree(degree: string | undefined): string {
  if (!degree) return "";

  const d = degree.toLowerCase();

  // Map common variations to standard values
  if (d.includes("bachelor") || d.includes("sarjana") || d === "s1") return "S1";
  if (d.includes("master") || d.includes("magister") || d === "s2") return "S2";
  if (d.includes("doctor") || d.includes("doktor") || d === "phd" || d === "s3") return "S3";
  if (d.includes("diploma 4") || d.includes("d4") || d === "d-4") return "D4";
  if (d.includes("diploma 3") || d.includes("d3") || d === "d-3") return "D3";
  if (d.includes("diploma 2") || d.includes("d2") || d === "d-2") return "D2";
  if (d.includes("diploma 1") || d.includes("d1") || d === "d-1") return "D1";
  if (d.includes("sma") || d.includes("smk") || d.includes("high school")) return "SMA/SMK";
  if (d.includes("smp") || d.includes("junior high")) return "SMP";
  if (d.includes("sd") || d.includes("elementary")) return "SD";

  // Return original if can't normalize (allows freeform input)
  return degree;
}

// Helper: Normalize maxGpa to match GPA_SCALE_OPTIONS values ("4.0", "5.0", "100")
function normalizeMaxGpa(maxGpa: string): string {
  const num = parseFloat(maxGpa);
  if (isNaN(num)) return "4.0";

  // Match to available options
  if (num >= 100) return "100";
  if (num >= 5) return "5.0";
  return "4.0";
}

// Helper: Parse GPA format "3.80/4.00" to { gpa, maxGpa }
function parseGpaFormat(gpaStr: string | undefined): { gpa: string; maxGpa: string } {
  if (!gpaStr) return { gpa: "", maxGpa: "4.0" };

  // Format: "3.80/4.00"
  const match = gpaStr.match(/^([\d.]+)\s*\/\s*([\d.]+)$/);
  if (match) {
    return { gpa: match[1], maxGpa: normalizeMaxGpa(match[2]) };
  }

  // Just a number
  return { gpa: gpaStr, maxGpa: "4.0" };
}

// Helper: Convert additional fields (skills, languages, etc.) to custom section items
function additionalToCustomSectionItems(additional: FormData["additional"]) {
  if (!additional) return [];

  const items: { id: string; title: string; subtitle: string; startDate: string; endDate: string; isCurrent: boolean; description: string[]; descriptionHtml: string; }[] = [];

  if (additional.skills && additional.skills.length > 0) {
    const content = additional.skills.join(", ");
    items.push({
      id: `item-skills-${Date.now()}`,
      title: "Skills",
      subtitle: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: [content],
      descriptionHtml: `<p>${content}</p>`,
    });
  }
  if (additional.languages && additional.languages.length > 0) {
    const content = additional.languages.join(", ");
    items.push({
      id: `item-languages-${Date.now()}`,
      title: "Languages",
      subtitle: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: [content],
      descriptionHtml: `<p>${content}</p>`,
    });
  }
  if (additional.certifications && additional.certifications.length > 0) {
    const content = additional.certifications.join(", ");
    items.push({
      id: `item-certifications-${Date.now()}`,
      title: "Certifications",
      subtitle: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: [content],
      descriptionHtml: `<p>${content}</p>`,
    });
  }
  if (additional.achievements && additional.achievements.length > 0) {
    const content = additional.achievements.join(", ");
    items.push({
      id: `item-achievements-${Date.now()}`,
      title: "Achievements",
      subtitle: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: [content],
      descriptionHtml: `<p>${content}</p>`,
    });
  }

  return items;
}

// Helper: Parse text from customSection (legacy format) into items
function parseTextToItems(text: string): { id: string; title: string; subtitle: string; startDate: string; endDate: string; isCurrent: boolean; description: string[]; descriptionHtml: string; }[] {
  if (!text || !text.trim()) return [];

  const items: { id: string; title: string; subtitle: string; startDate: string; endDate: string; isCurrent: boolean; description: string[]; descriptionHtml: string; }[] = [];

  // Parse lines like "• Skills: Java, Python, ..." or "Skills: Java, Python, ..."
  const lines = text.split("\n").filter(line => line.trim());

  for (const line of lines) {
    // Remove bullet point if exists
    const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();

    // Try to parse "Title: Content" format
    const colonIndex = cleanLine.indexOf(":");
    if (colonIndex > 0) {
      const title = cleanLine.substring(0, colonIndex).trim();
      const content = cleanLine.substring(colonIndex + 1).trim();

      if (title && content) {
        items.push({
          id: `item-${title.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title,
          subtitle: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          description: [content],
          descriptionHtml: `<p>${content}</p>`,
        });
      }
    }
  }

  return items;
}

// Normalize data to ensure all required fields have default values
function normalizeFormData(data: FormData): FormData {
  return {
    ...data,
    personalData: {
      name: data.personalData?.name || "",
      phone: data.personalData?.phone || "",
      email: data.personalData?.email || "",
      location: data.personalData?.location || "",
      website: data.personalData?.website || "",
      linkedin: data.personalData?.linkedin || "",
      github: data.personalData?.github || "",
    },
    summary: data.summary || "",
    educations: (data.educations || []).map((edu, idx) => {
      const descArr = Array.isArray(edu.description) ? edu.description : edu.description ? [edu.description] : [];
      const { gpa, maxGpa } = parseGpaFormat(edu.gpa);
      // Always normalize maxGpa to match dropdown options
      const normalizedMaxGpa = normalizeMaxGpa(edu.maxGpa || maxGpa);
      return {
        id: edu.id || `edu-${idx}`,
        institution: edu.institution || "",
        degree: normalizeDegree(edu.degree),
        major: edu.major || "",
        location: edu.location || "",
        gpa: edu.gpa ? gpa : (edu as { gpaValue?: string }).gpaValue || "",
        maxGpa: normalizedMaxGpa,
        startDate: normalizeDateFormat(edu.startDate),
        endDate: normalizeDateFormat(edu.endDate),
        isCurrent: edu.isCurrent || edu.endDate?.toLowerCase().includes("present") || false,
        description: descArr,
        descriptionHtml: edu.descriptionHtml || descriptionToHtml(descArr),
      };
    }),
    workExperiences: (data.workExperiences || []).map((work, idx) => {
      const descArr = Array.isArray(work.description) ? work.description : work.description ? [work.description] : [];
      return {
        id: work.id || `work-${idx}`,
        position: work.position || "",
        company: work.company || "",
        location: work.location || "",
        startDate: normalizeDateFormat(work.startDate),
        endDate: normalizeDateFormat(work.endDate),
        isCurrent: work.isCurrent || work.endDate?.toLowerCase().includes("present") || false,
        description: descArr,
        descriptionHtml: work.descriptionHtml || descriptionToHtml(descArr),
      };
    }),
    organizationExperiences: (data.organizationExperiences || []).map((org, idx) => {
      const descArr = Array.isArray(org.description) ? org.description : org.description ? [org.description] : [];
      return {
        id: org.id || `org-${idx}`,
        position: org.position || "",
        organization: org.organization || "",
        startDate: normalizeDateFormat(org.startDate),
        endDate: normalizeDateFormat(org.endDate),
        isCurrent: org.isCurrent || org.endDate?.toLowerCase().includes("present") || false,
        description: descArr,
        descriptionHtml: org.descriptionHtml || descriptionToHtml(descArr),
      };
    }),
    personalProjects: (data.personalProjects || []).map((project, idx) => {
      const descArr = Array.isArray(project.description) ? project.description : project.description ? [project.description] : [];
      return {
        id: project.id || `project-${idx}`,
        name: project.name || "",
        role: project.role || "",
        location: project.location || "",
        startDate: normalizeDateFormat(project.startDate),
        endDate: normalizeDateFormat(project.endDate),
        isCurrent: project.isCurrent || project.endDate?.toLowerCase().includes("present") || false,
        description: descArr,
        descriptionHtml: project.descriptionHtml || descriptionToHtml(descArr),
      };
    }),
    additional: {
      skills: data.additional?.skills || [],
      languages: data.additional?.languages || [],
      certifications: data.additional?.certifications || [],
      achievements: data.additional?.achievements || [],
    },
    customSections: (() => {
      // Parse existing customSections from LLM
      const existingCustomSections = (data.customSections || []).map((section, idx) => {
        // Get existing items
        const existingItems = (section.items || []).map((item, itemIdx) => {
          const descArr = Array.isArray(item.description) ? item.description : item.description ? [item.description] : [];
          return {
            id: item.id || `item-${itemIdx}`,
            title: item.title || "",
            subtitle: item.subtitle || "",
            startDate: normalizeDateFormat(item.startDate),
            endDate: normalizeDateFormat(item.endDate),
            isCurrent: item.isCurrent || item.endDate?.toLowerCase().includes("present") || false,
            description: descArr,
            descriptionHtml: item.descriptionHtml || descriptionToHtml(descArr),
          };
        });

        // If section has text but no/few items, parse text into items
        const textItems = parseTextToItems(section.text || "");

        // Merge: existing items first, then text items (avoid duplicates by title)
        const existingTitles = new Set(existingItems.map(i => i.title.toLowerCase()));
        const mergedItems = [
          ...existingItems,
          ...textItems.filter(ti => !existingTitles.has(ti.title.toLowerCase())),
        ];

        return {
          sectionKey: section.sectionKey || `section-${idx}`,
          sectionTitle: section.sectionTitle || "Untitled",
          sectionType: "itemList" as const, // Always use itemList for editor
          text: "", // Clear text since we converted to items
          items: mergedItems,
        };
      });

      // Convert additional fields to items and add to "Additional" section
      const additionalItems = additionalToCustomSectionItems(data.additional);
      if (additionalItems.length > 0) {
        // Find existing "additional" section or create new one
        const additionalSectionIdx = existingCustomSections.findIndex(s => s.sectionKey === "additional");
        if (additionalSectionIdx >= 0) {
          // Merge items into existing section (avoid duplicates by title)
          const existingTitles = new Set(existingCustomSections[additionalSectionIdx].items.map(i => i.title.toLowerCase()));
          const newItems = additionalItems.filter(ai => !existingTitles.has(ai.title.toLowerCase()));
          existingCustomSections[additionalSectionIdx].items = [
            ...existingCustomSections[additionalSectionIdx].items,
            ...newItems,
          ];
        } else {
          // Create new "Additional" section
          existingCustomSections.push({
            sectionKey: "additional",
            sectionTitle: "Additional",
            sectionType: "itemList" as const,
            text: "",
            items: additionalItems,
          });
        }
      }

      return existingCustomSections;
    })(),
    sectionTitles: data.sectionTitles || {},
    sectionOrder: data.sectionOrder || undefined,
    // Preserve othersItems for the Others section (unlimited dynamic items)
    othersItems: data.othersItems || [],
  };
}

export function CVEditor({ cvId, initialData }: CVEditorProps) {
  const router = useRouter();
  // Normalize data on initial load to ensure all fields have defaults
  const normalizedInitialData = useMemo(() => normalizeFormData(initialData), [initialData]);
  const [data, setData] = useState<FormData>(normalizedInitialData);
  const [currentStep, setCurrentStep] = useState<EditorStep>("personal");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [mobilePanel, setMobilePanel] = useState<"form" | "preview">("form");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // Track if desktop view
  const previousStepRef = useRef<EditorStep>(currentStep);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const lastSavedDataRef = useRef<string>(JSON.stringify(normalizedInitialData));

  // Resizable panel state (desktop only)
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Min and max width constraints for left panel (in percentage)
  const MIN_LEFT_WIDTH = 35;
  const MAX_LEFT_WIDTH = 65;

  // Track window size for responsive behavior
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDesktop) return; // Only allow resize on desktop
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [isDesktop]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current || !isDesktop) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Clamp to min/max
      const clampedWidth = Math.min(Math.max(newWidth, MIN_LEFT_WIDTH), MAX_LEFT_WIDTH);
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDesktop]);

  // Check if data has changed since last save
  const hasDataChanged = useCallback(() => {
    const currentDataStr = JSON.stringify(data);
    return currentDataStr !== lastSavedDataRef.current;
  }, [data]);

  // Calculate progress
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  // Transform data for API - preserve descriptionHtml for rich text formatting
  const transformDataForAPI = useCallback((formData: FormData) => {
    return {
      ...formData,
      educations: formData.educations.map((edu) => ({
        ...edu,
        descriptionHtml: edu.descriptionHtml || "",
        description: Array.isArray(edu.description)
          ? edu.description.join("\n")
          : edu.description || "",
        location: edu.location || "",
      })),
      workExperiences: formData.workExperiences.map((work) => ({
        ...work,
        descriptionHtml: work.descriptionHtml || "",
        description: Array.isArray(work.description)
          ? work.description.join("\n")
          : work.description || "",
        location: work.location || "",
      })),
      organizationExperiences: formData.organizationExperiences.map((org) => ({
        ...org,
        descriptionHtml: org.descriptionHtml || "",
        description: Array.isArray(org.description)
          ? org.description.join("\n")
          : org.description || "",
      })),
      personalProjects: (formData.personalProjects || []).map((project) => ({
        ...project,
        descriptionHtml: project.descriptionHtml || "",
        description: Array.isArray(project.description)
          ? project.description.join("\n")
          : project.description || "",
      })),
      customSections: (formData.customSections || []).map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          descriptionHtml: item.descriptionHtml || "",
          description: Array.isArray(item.description)
            ? item.description.join("\n")
            : item.description || "",
        })),
      })),
      // Preserve othersItems for the Others section
      othersItems: formData.othersItems || [],
    };
  }, []);

  // Save function
  const handleSave = useCallback(async (force = false) => {
    // Skip save if no changes (unless forced)
    if (!force && !hasDataChanged()) {
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");
    try {
      const transformedData = transformDataForAPI(data);

      const response = await fetch(`/api/cv/${cvId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error("Failed to save CV");
      }

      // Update last saved data reference
      lastSavedDataRef.current = JSON.stringify(data);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving CV:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [cvId, data, transformDataForAPI, hasDataChanged]);

  // Auto-save when step changes
  useEffect(() => {
    if (previousStepRef.current !== currentStep) {
      handleSave();
      previousStepRef.current = currentStep;
    }
  }, [currentStep, handleSave]);

  // Debounced auto-save when data changes (15 second delay)
  useEffect(() => {
    // Skip initial mount to avoid saving on load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if no changes
    if (!hasDataChanged()) {
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save (15 second delay)
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 15000);

    // Cleanup on unmount or when data changes again
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, handleSave, hasDataChanged]);

  // Save before page unload or tab hidden
  useEffect(() => {
    // Use sendBeacon to save data (works reliably even when page is closing)
    const saveWithBeacon = () => {
      if (hasDataChanged()) {
        const transformedData = transformDataForAPI(data);
        const blob = new Blob([JSON.stringify(transformedData)], { type: 'application/json' });
        navigator.sendBeacon(`/api/cv/${cvId}`, blob);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Try to save on page unload
      saveWithBeacon();

      // Show warning if still saving
      if (saveStatus === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    // Also save when tab becomes hidden (more reliable than beforeunload)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveWithBeacon();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [saveStatus, data, cvId, hasDataChanged, transformDataForAPI]);

  // Download PDF
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Auto-save before download to ensure latest changes are saved
      if (hasDataChanged()) {
        await handleSave(true);
      }

      const response = await fetch(`/api/cv/${cvId}/download`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download CV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV-${data.personalData.name || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading CV:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Navigation
  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
      formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
      formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get current form component
  const FormComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="fixed inset-0 flex flex-col bg-neutral-100">
      {/* Header */}
      <EditorHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        saveStatus={saveStatus}
        onSave={() => handleSave(true)}
        hasUnsavedChanges={hasDataChanged()}
      />

      {/* Main Content */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {viewMode === "edit" ? (
          <>
            {/* Left Panel - Form */}
            {/* Mobile: Full width */}
            {/* Desktop: Resizable width with percentage */}
            <div
              className={`flex flex-col bg-white ${mobilePanel === "preview" ? "hidden md:flex" : "flex"}`}
              style={isDesktop ? {
                width: `${leftPanelWidth}%`,
                minWidth: `${MIN_LEFT_WIDTH}%`,
                maxWidth: `${MAX_LEFT_WIDTH}%`,
                flexShrink: 0,
              } : {
                width: '100%',
              }}
            >
              {/* Progress Bar */}
              <EditorProgress
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                progress={progress}
              />

              {/* Form Content */}
              <div
                ref={formContainerRef}
                className="flex-1 overflow-y-auto @container"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#d4d4d4 transparent" }}
              >
                <div className="px-4 sm:px-6 py-6 sm:py-8">
                  <FormComponent data={data} setData={setData} />
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-neutral-200 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={goToPrevStep}
                    disabled={currentStepIndex === 0}
                    className="gap-1 sm:gap-2 px-2 sm:px-4"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </Button>

                  {/* Mobile: Preview Toggle Button */}
                  <Button
                    variant="outline"
                    onClick={() => setMobilePanel("preview")}
                    className="md:hidden gap-1 px-3"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>

                  {/* Desktop: Save Status */}
                  <div className="hidden md:flex items-center gap-2 text-sm text-neutral-500">
                    {saveStatus === "saving" && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    )}
                    {saveStatus === "saved" && (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600">Tersimpan</span>
                      </>
                    )}
                    {saveStatus === "error" && (
                      <span className="text-red-500">Gagal menyimpan</span>
                    )}
                  </div>

                  {currentStepIndex < STEPS.length - 1 ? (
                    <Button
                      onClick={goToNextStep}
                      className="gap-1 sm:gap-2 px-2 sm:px-4 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <span className="hidden sm:inline">Selanjutnya</span>
                      <span className="sm:hidden">Lanjut</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="gap-1 sm:gap-2 bg-emerald-600 hover:bg-emerald-700 px-2 sm:px-4"
                      size="sm"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">Mengunduh...</span>
                        </>
                      ) : (
                        <span>Unduh PDF</span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Resizable Divider - Desktop only */}
            <div
              className="hidden md:flex w-2 bg-neutral-200 hover:bg-neutral-300 cursor-col-resize items-center justify-center group transition-colors relative flex-shrink-0"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-y-0 -left-1 -right-1" />
              <GripVertical className="w-3 h-3 text-neutral-400 group-hover:text-white" />
            </div>

            {/* Right Panel - Preview */}
            <div
              className={`flex-1 flex flex-col bg-neutral-50 min-w-0 ${mobilePanel === "form" ? "hidden md:flex" : "flex"}`}
            >
              {/* Mobile: Back to Edit button */}
              <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
                <Button
                  variant="outline"
                  onClick={() => setMobilePanel("form")}
                  className="gap-1"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </Button>
                <span className="text-sm text-neutral-500">Live Preview</span>
              </div>

              {/* Auto-scaling Preview */}
              <div className="flex-1 min-h-0">
                <AutoScalePreview data={data} />
              </div>
            </div>
          </>
        ) : (
          /* Full Preview Mode */
          <div
            className="flex-1 overflow-auto bg-neutral-100 p-4 sm:p-8"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#a3a3a3 transparent" }}
          >
            <div className="flex justify-center pb-8">
              <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
                <CVPreview data={data} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
