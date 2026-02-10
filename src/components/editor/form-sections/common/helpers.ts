import { htmlToLines, linesToHtml } from "@/components/ui/rich-text-editor";

// Helper to get description HTML (handles migration from old format)
export function getDescriptionHtml(item: { descriptionHtml?: string; description?: string | string[] }): string {
  if (item.descriptionHtml) return item.descriptionHtml;
  if (item.description) {
    if (Array.isArray(item.description) && item.description.length > 0) {
      return linesToHtml(item.description);
    }
    if (typeof item.description === "string" && item.description.trim()) {
      const lines = item.description.split("\n").filter(l => l.trim());
      if (lines.length > 0) {
        return linesToHtml(lines);
      }
    }
  }
  return "";
}

// Helper to update description (saves both formats for backward compatibility)
export function updateDescription(html: string): { descriptionHtml: string; description: string[] } {
  return {
    descriptionHtml: html,
    description: htmlToLines(html),
  };
}
