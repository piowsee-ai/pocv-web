"use client";

import React from "react";
import type { FormData } from "@/types/editor-form-data";

// F4 dimensions used by PDF download, rendered at 96 DPI.
const PDF_PAGE_WIDTH_PX = 8.28 * 96;
const PDF_PAGE_HEIGHT_PX = 11.71 * 96;
const PDF_PAGE_MARGIN_PX = 0.3 * 96;

interface CVPreviewProps {
  data: FormData;
  containerWidth?: number; // Container width in pixels for auto-scaling
}

// Helper to get description HTML or convert from array/string
function getDescriptionHtml(item: { descriptionHtml?: string; description?: string | string[] }): string {
  if (item.descriptionHtml) return item.descriptionHtml;
  if (item.description) {
    if (Array.isArray(item.description) && item.description.length > 0) {
      return `<ul>${item.description.map((line) => `<li>${line}</li>`).join("")}</ul>`;
    }
    if (typeof item.description === "string" && item.description.trim()) {
      const lines = item.description.split("\n").filter(l => l.trim());
      if (lines.length > 0) {
        return `<ul>${lines.map((line) => `<li>${line}</li>`).join("")}</ul>`;
      }
    }
  }
  return "";
}

// Helper to check if there's any description content
function hasDescription(item: { descriptionHtml?: string; description?: string | string[] }): boolean {
  if (item.descriptionHtml && item.descriptionHtml.trim() && item.descriptionHtml !== "<p></p>") return true;
  if (item.description) {
    if (Array.isArray(item.description) && item.description.length > 0 && item.description.some(d => d.trim())) return true;
    if (typeof item.description === "string" && item.description.trim()) return true;
  }
  return false;
}

// Helper to check if summary has content (could be HTML or plain text)
function hasSummary(summary: string): boolean {
  if (!summary) return false;
  const trimmed = summary.trim();
  if (!trimmed) return false;
  // Check if it's empty HTML
  if (trimmed === "<p></p>" || trimmed === "<p><br></p>") return false;
  return true;
}

// Helper to check if education entry has required content
function hasEducationContent(edu: { institution?: string; degree?: string; major?: string }): boolean {
  return Boolean(edu.institution?.trim() || edu.degree?.trim() || edu.major?.trim());
}

// Helper to check if work experience entry has required content
function hasWorkExperienceContent(exp: { company?: string; position?: string }): boolean {
  return Boolean(exp.company?.trim() || exp.position?.trim());
}

// Helper to check if organization entry has required content
function hasOrganizationContent(org: { organization?: string; position?: string }): boolean {
  return Boolean(org.organization?.trim() || org.position?.trim());
}

// Helper to check if personal project entry has required content
function hasProjectContent(project: { name?: string }): boolean {
  return Boolean(project.name?.trim());
}

function getGpaDisplay(gpa: string | undefined, maxGpa: string | undefined): string {
  if (!gpa) return "";
  if (gpa.includes("/")) return gpa;
  return `${gpa}/${maxGpa || "4.0"}`;
}

function parseDateValue(dateStr: string): Date | null {
  if (!dateStr || /\b(expected|present)\b/i.test(dateStr)) return null;

  const yyyyMmMatch = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (yyyyMmMatch) {
    return new Date(parseInt(yyyyMmMatch[1], 10), parseInt(yyyyMmMatch[2], 10) - 1);
  }

  const mmYyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYyyyMatch) {
    return new Date(parseInt(mmYyyyMatch[2], 10), parseInt(mmYyyyMatch[1], 10) - 1);
  }

  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatParsedDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function withExpectedSuffix(displayDate: string, rawDate: string): string {
  if (!displayDate || /\(Expected\)/i.test(displayDate)) return displayDate;

  const parsedEndDate = parseDateValue(rawDate);
  if (!parsedEndDate) return displayDate;

  return parsedEndDate > new Date() ? `${displayDate} (Expected)` : displayDate;
}

function getEntryDateDisplay(dateText: string | undefined): string {
  if (!dateText) return "";

  const parts = dateText.split(" - ");
  if (parts.length !== 2) return dateText;

  const startDate = parseDateValue(parts[0].trim());
  const endDate = parseDateValue(parts[1].trim());

  if (!startDate) return dateText;
  if (!endDate) return `${formatParsedDate(startDate)} - Present`;

  const formattedEnd = formatParsedDate(endDate);
  return `${formatParsedDate(startDate)} - ${withExpectedSuffix(formattedEnd, parts[1].trim())}`;
}

export function CVPreview({ data, containerWidth }: CVPreviewProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number>(0);

  // Calculate scale based on container width. The preview mirrors the PDF's
  // F4 page size and only scales down, never up beyond the original size.
  const padding = 32; // 16px padding on each side
  const availableWidth = containerWidth ? containerWidth - padding : PDF_PAGE_WIDTH_PX;

  // Scale is always <= 1 (never larger than the PDF page).
  const scale = Math.max(Math.min(availableWidth / PDF_PAGE_WIDTH_PX, 1), 0.2);

  // Measure content height and update container
  React.useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [scale, data]);

  const formatDate = (dateStr: string, isCurrent?: boolean): string => {
    if (isCurrent) return "Present";
    if (!dateStr) return "";

    // Handle YYYY-MM format (from MonthPickerInput)
    const yyyyMmMatch = dateStr.match(/^(\d{4})-(\d{2})$/);
    if (yyyyMmMatch) {
      const year = parseInt(yyyyMmMatch[1], 10);
      const month = parseInt(yyyyMmMatch[2], 10);
      const date = new Date(year, month - 1);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }

    // Handle MM/YYYY format (legacy)
    const mmYyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
    if (mmYyyyMatch) {
      const month = parseInt(mmYyyyMatch[1], 10);
      const year = parseInt(mmYyyyMatch[2], 10);
      const date = new Date(year, month - 1);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }

    return dateStr;
  };

  // Helper to get date range display
  // Validation: Only show date range if it makes sense
  // - If isCurrent but no startDate, show nothing (invalid state)
  // - If only endDate without startDate, show just the endDate
  // - If only startDate without endDate and not isCurrent, show just startDate
  const getDateRange = (startDate: string, endDate: string, isCurrent?: boolean): string => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    const endWithExpected = withExpectedSuffix(end, endDate);

    // If isCurrent is checked
    if (isCurrent) {
      // Must have a start date for "Present" to make sense
      if (!start) return "";
      return `${start} - Present`;
    }

    // Normal date range
    if (!start && !end) return "";
    if (!start) return endWithExpected; // Only end date
    if (!end) return start; // Only start date
    return `${start} - ${endWithExpected}`;
  };

  // CSS for the HTML content rendering
  const htmlContentStyles = `
    .cv-preview-container {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .cv-pdf-page {
      line-height: 1.4;
      color: #000;
      background-color: #fff;
    }
    .cv-pdf-content {
      padding: ${PDF_PAGE_MARGIN_PX}px;
    }
    .cv-pdf-header {
      text-align: center;
      margin-bottom: 25px;
      margin-top: 9.5px;
    }
    .cv-pdf-header-name {
      font-size: 18pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }
    .cv-pdf-contact {
      display: flex;
      color: #505050;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 8.5pt;
      margin-bottom: 2px;
    }
    .cv-pdf-section {
      margin-bottom: 11px;
    }
    .cv-pdf-section-title {
      font-size: 12.5pt;
      font-weight: bold;
      margin-bottom: 8px;
      border-bottom: 1.5px solid #000;
      padding-bottom: 2px;
      padding-left: 0;
    }
    .cv-pdf-entry {
      margin-bottom: 10px;
      padding-left: 0;
    }
    .cv-pdf-entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1.5px;
      font-size: 9pt;
    }
    .cv-pdf-entry-title {
      font-weight: bold;
      font-size: 9pt;
    }
    .cv-pdf-entry-date {
      font-size: 8.5pt;
      font-weight: 400;
      white-space: nowrap;
      color: black;
      text-align: right;
    }
    .cv-pdf-entry-subtitle {
      font-style: italic;
      font-size: 9pt;
      margin-bottom: 4px;
    }
    .html-content {
      word-break: break-word;
      overflow-wrap: break-word;
      text-align: justify;
      text-justify: inter-word;
    }
    .html-content ul {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    ul.html-content {
      list-style: none;
      padding-left: 0;
      margin: 0;
    }
    .html-content ol {
      list-style: none;
      counter-reset: cv-preview-list;
      padding-left: 0;
      margin: 0;
    }
    ol.html-content {
      list-style: none;
      counter-reset: cv-preview-list;
      padding-left: 0;
      margin: 0;
    }
    .html-content li {
      position: relative;
      display: block;
      margin-bottom: 2px;
      padding-left: 0.75rem;
      text-align: left;
      text-justify: auto;
    }
    .html-content ul > li::before {
      content: "\\2022";
      position: absolute;
      left: 0;
      width: 0.4rem;
      text-align: left;
    }
    ul.html-content > li::before {
      content: "\\2022";
      position: absolute;
      left: 0;
      width: 0.4rem;
      text-align: left;
    }
    .html-content ol > li {
      counter-increment: cv-preview-list;
      padding-left: 1rem;
    }
    .html-content ol > li::before {
      content: counter(cv-preview-list) ".";
      position: absolute;
      left: 0;
      width: 0.75rem;
      text-align: right;
    }
    ol.html-content > li::before {
      content: counter(cv-preview-list) ".";
      position: absolute;
      left: 0;
      width: 0.75rem;
      text-align: right;
    }
    .html-content li p {
      display: inline;
      margin: 0;
    }
    .html-content p {
      margin: 0 0 4px 0;
    }
    .html-content strong {
      font-weight: 600;
    }
    .html-content em {
      font-style: italic;
    }
  `;

  // Fixed font sizes (will be scaled via transform)
  const fontSize = {
    name: "18pt",
    contact: "8.5pt",
    sectionTitle: "12.5pt",
    body: "9pt",
    date: "8.5pt",
  };

  const actualPageHeight = contentHeight > 0 ? Math.max(contentHeight, PDF_PAGE_HEIGHT_PX) : PDF_PAGE_HEIGHT_PX;
  const pageBreakCount = Math.floor((actualPageHeight - 1) / PDF_PAGE_HEIGHT_PX);

  const containerStyle: React.CSSProperties = {
    width: `${PDF_PAGE_WIDTH_PX * scale}px`,
    height: `${actualPageHeight * scale}px`,
    overflow: 'hidden',
  };

  // Page style - always fixed F4 width, min F4 height but can grow.
  const pageStyle: React.CSSProperties = {
    width: `${PDF_PAGE_WIDTH_PX}px`,
    minHeight: `${PDF_PAGE_HEIGHT_PX}px`,
    fontFamily: "Arial, sans-serif",
    textAlign: "justify",
    textJustify: "inter-word",
    position: "relative",
  };

  return (
    <div className="cv-preview-container" style={containerStyle}>
      <style dangerouslySetInnerHTML={{ __html: htmlContentStyles }} />

      <div
        ref={contentRef}
        className="bg-white cv-pdf-page"
        style={{
          ...pageStyle,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {Array.from({ length: pageBreakCount }, (_, index) => (
          <div
            key={`page-break-${index}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: `${(index + 1) * PDF_PAGE_HEIGHT_PX}px`,
              left: 0,
              right: 0,
              borderTop: "1.5px dashed #9ca3af",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        ))}

        <div className="cv-pdf-content">
          {/* Header Section */}
          <div className="text-center mb-4 cv-pdf-header">
            <h1
              className="font-bold uppercase tracking-wide mb-1 cv-pdf-header-name"
              style={{ fontSize: fontSize.name, letterSpacing: "0.8px" }}
            >
              {data.personalData.name || "Nama Lengkap"}
            </h1>

            <div
              className="flex justify-center flex-wrap text-gray-600 cv-pdf-contact"
              style={{ fontSize: fontSize.contact }}
            >
              {(() => {
                const items: React.ReactNode[] = [];
                if (data.personalData.location) {
                  items.push(<span key="location">{data.personalData.location}</span>);
                }
                if (data.personalData.phone) {
                  items.push(
                    <a key="phone" href={`tel:${data.personalData.phone}`} className="text-gray-500 no-underline hover:underline">
                      {data.personalData.phone}
                    </a>
                  );
                }
                if (data.personalData.email) {
                  items.push(
                    <a key="email" href={`mailto:${data.personalData.email}`} className="text-gray-500 no-underline hover:underline">
                      {data.personalData.email}
                    </a>
                  );
                }
                if (data.personalData.linkedin) {
                  items.push(
                    <a key="linkedin" href={data.personalData.linkedin} className="text-gray-500 no-underline hover:underline">
                      {data.personalData.linkedin}
                    </a>
                  );
                }
                if (data.personalData.github) {
                  items.push(
                    <a key="github" href={data.personalData.github} className="text-gray-500 no-underline hover:underline">
                      {data.personalData.github}
                    </a>
                  );
                }
                if (data.personalData.website) {
                  items.push(
                    <a key="website" href={data.personalData.website} className="text-gray-500 no-underline hover:underline">
                      {data.personalData.website}
                    </a>
                  );
                }
                return items.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="mx-1.5 text-black">|</span>}
                    {item}
                  </React.Fragment>
                ));
              })()}
            </div>
          </div>

          {/* Summary Section */}
          {hasSummary(data.summary) && (
            <div className="mb-3 cv-pdf-section">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.summary || "Summary"}
              </h2>
              <div
                className="html-content cv-pdf-entry"
                style={{ fontSize: fontSize.body }}
                dangerouslySetInnerHTML={{ __html: data.summary }}
              />
            </div>
          )}

          {/* Education Section */}
          {data.educations && data.educations.filter(hasEducationContent).length > 0 && (
            <div className="mb-3 cv-pdf-section">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.education || "Education"}
              </h2>
              {data.educations.filter(hasEducationContent).map((edu, index) => (
                <div key={edu.id || index} className="mb-2.5 cv-pdf-entry">
                  <div
                    className="flex justify-between items-baseline mb-0.5 cv-pdf-entry-header"
                    style={{ fontSize: fontSize.body }}
                  >
                    <div className="font-bold cv-pdf-entry-title">
                      {edu.institution}
                      {edu.location && (
                        <span className="text-gray-500"> - {edu.location}</span>
                      )}
                    </div>
                    <div
                      className="whitespace-nowrap cv-pdf-entry-date"
                      style={{ fontSize: fontSize.date }}
                    >
                      {getDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                    </div>
                  </div>
                  <div className="italic mb-1 cv-pdf-entry-subtitle" style={{ fontSize: fontSize.body }}>
                    {edu.degree} in {edu.major}
                    {edu.gpa && `, GPA: ${getGpaDisplay(edu.gpa, edu.maxGpa)}`}
                  </div>
                  {hasDescription(edu) && (
                    <div
                      className="html-content mt-1"
                      style={{ fontSize: fontSize.body }}
                      dangerouslySetInnerHTML={{ __html: getDescriptionHtml(edu) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Work Experience Section */}
          {data.workExperiences && data.workExperiences.filter(hasWorkExperienceContent).length > 0 && (
            <div className="mb-3 cv-pdf-section">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.workExperience || "Work Experience"}
              </h2>
              {data.workExperiences.filter(hasWorkExperienceContent).map((exp, index) => (
                <div key={exp.id || index} className="mb-2.5 cv-pdf-entry">
                  <div
                    className="flex justify-between items-baseline mb-0.5 cv-pdf-entry-header"
                    style={{ fontSize: fontSize.body }}
                  >
                    <div className="font-bold cv-pdf-entry-title">
                      {exp.company}
                      {exp.location && <span className="text-gray-500"> - {exp.location}</span>}
                    </div>
                    <div
                      className="whitespace-nowrap cv-pdf-entry-date"
                      style={{ fontSize: fontSize.date }}
                    >
                      {getDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </div>
                  </div>
                  <div className="italic mb-1 cv-pdf-entry-subtitle" style={{ fontSize: fontSize.body }}>
                    {exp.position}
                  </div>
                  {hasDescription(exp) && (
                    <div
                      className="html-content mt-1"
                      style={{ fontSize: fontSize.body }}
                      dangerouslySetInnerHTML={{ __html: getDescriptionHtml(exp) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Organization Experience Section */}
          {data.organizationExperiences &&
            data.organizationExperiences.filter(hasOrganizationContent).length > 0 && (
              <div className="mb-3 cv-pdf-section">
                <h2
                  className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                  style={{ fontSize: fontSize.sectionTitle }}
                >
                  {data.sectionTitles?.organization || "Organisational Experience"}
                </h2>
                {data.organizationExperiences.filter(hasOrganizationContent).map((org, index) => (
                  <div key={org.id || index} className="mb-2.5 cv-pdf-entry">
                    <div
                      className="flex justify-between items-baseline mb-0.5 cv-pdf-entry-header"
                      style={{ fontSize: fontSize.body }}
                    >
                      <div className="font-bold cv-pdf-entry-title">{org.organization}</div>
                      <div
                        className="whitespace-nowrap cv-pdf-entry-date"
                        style={{ fontSize: fontSize.date }}
                      >
                        {getDateRange(org.startDate, org.endDate, org.isCurrent)}
                      </div>
                    </div>
                    <div className="italic mb-1 cv-pdf-entry-subtitle" style={{ fontSize: fontSize.body }}>
                      {org.position}
                    </div>
                    {hasDescription(org) && (
                      <div
                        className="html-content mt-1"
                        style={{ fontSize: fontSize.body }}
                        dangerouslySetInnerHTML={{ __html: getDescriptionHtml(org) }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

          {/* Projects Section */}
          {data.personalProjects && data.personalProjects.filter(hasProjectContent).length > 0 && (
            <div className="mb-3 cv-pdf-section">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.projects || "Projects"}
              </h2>
              {data.personalProjects.filter(hasProjectContent).map((project, index) => (
                <div key={project.id || index} className="mb-2.5 cv-pdf-entry">
                  <div
                    className="flex justify-between items-baseline mb-0.5 cv-pdf-entry-header"
                    style={{ fontSize: fontSize.body }}
                  >
                    <div className="font-bold cv-pdf-entry-title">{project.name}</div>
                  </div>
                  {hasDescription(project) && (
                    <div
                      className="html-content mt-1"
                      style={{ fontSize: fontSize.body }}
                      dangerouslySetInnerHTML={{ __html: getDescriptionHtml(project) }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && data.customSections.map((section) => {
            const hasContent = section.items && section.items.some(item => item.title?.trim());
            if (!hasContent) return null;

            return (
              <div key={section.sectionKey} className="mb-3 cv-pdf-section">
                <h2
                  className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                  style={{ fontSize: fontSize.sectionTitle }}
                >
                  {section.sectionTitle || "Untitled"}
                </h2>
                {section.items.filter(item => item.title?.trim()).map((item, index) => (
                  <div key={item.id || index} className="mb-2.5 cv-pdf-entry">
                    <div
                      className="flex justify-between items-baseline mb-0.5 cv-pdf-entry-header"
                      style={{ fontSize: fontSize.body }}
                    >
                      <div className="font-bold cv-pdf-entry-title">
                        {item.title}
                      </div>
                      {item.years && (
                        <div
                          className="whitespace-nowrap cv-pdf-entry-date"
                          style={{ fontSize: fontSize.date }}
                        >
                          {getEntryDateDisplay(item.years)}
                        </div>
                      )}
                    </div>
                    {item.subtitle && (
                      <div className="italic mb-1 cv-pdf-entry-subtitle" style={{ fontSize: fontSize.body }}>
                        {item.subtitle}
                      </div>
                    )}
                    {hasDescription(item) && (
                      <div
                        className="html-content mt-1"
                        style={{ fontSize: fontSize.body }}
                        dangerouslySetInnerHTML={{ __html: getDescriptionHtml(item) }}
                      />
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Others Section - Dynamic items with free titles */}
          {data.othersItems && data.othersItems.length > 0 && data.othersItems.some(item => item.title || item.descriptionHtml) && (
            <div className="mb-3 cv-pdf-section">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 mb-2 cv-pdf-section-title"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.others || "Skills, Achievements & Other Experience"}
              </h2>
              <ul className="html-content space-y-0.5" style={{ fontSize: fontSize.body }}>
                {data.othersItems.filter(item => item.title || item.descriptionHtml).map((item) => {
                  return (
                    <li key={item.id}>
                      {item.title && <span className="font-bold">{item.title}:</span>}{" "}
                      <span
                        className="[&_p]:inline [&_p]:m-0"
                        dangerouslySetInnerHTML={{ __html: item.descriptionHtml || "" }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
