"use client";

import React from "react";
import type { FormData } from "@/types/editor-form-data";

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

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

export function CVPreview({ data, containerWidth }: CVPreviewProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number>(0);

  // Calculate scale based on container width
  // CV should ONLY scale DOWN, never UP beyond original A4 size
  // If containerWidth is provided and smaller than A4, scale down proportionally
  // Otherwise, use scale = 1 (A4 actual size)
  const padding = 32; // 16px padding on each side
  const availableWidth = containerWidth ? containerWidth - padding : A4_WIDTH_PX;

  // Scale is always <= 1 (never larger than A4)
  const scale = Math.max(Math.min(availableWidth / A4_WIDTH_PX, 1), 0.2);

  // Measure content height and update container
  React.useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height * scale);
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

    // If isCurrent is checked
    if (isCurrent) {
      // Must have a start date for "Present" to make sense
      if (!start) return "";
      return `${start} - Present`;
    }

    // Normal date range
    if (!start && !end) return "";
    if (!start) return end; // Only end date
    if (!end) return start; // Only start date
    return `${start} - ${end}`;
  };

  // CSS for the HTML content rendering
  const htmlContentStyles = `
    .cv-preview-container {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .html-content {
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .html-content ul {
      list-style-type: disc;
      list-style-position: outside;
      padding-left: 1.25rem;
      margin: 0;
    }
    .html-content ol {
      list-style-type: decimal;
      list-style-position: outside;
      padding-left: 1.25rem;
      margin: 0;
    }
    .html-content li {
      margin-bottom: 2px;
      padding-left: 0;
    }
    .html-content li p {
      display: inline;
      margin: 0;
    }
    .html-content p {
      margin: 0;
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
    name: "19pt",
    contact: "9.5pt",
    sectionTitle: "13.5pt",
    body: "10pt",
    date: "9.5pt",
  };

  // Container style - width is fixed, height is min A4 but grows with content
  const minHeightScaled = A4_HEIGHT_PX * scale;
  const actualHeight = contentHeight > 0 ? Math.max(contentHeight, minHeightScaled) : minHeightScaled;

  const containerStyle: React.CSSProperties = {
    width: `${A4_WIDTH_PX * scale}px`,
    height: `${actualHeight}px`,
    overflow: 'hidden',
  };

  // Page style - always fixed A4 width, min A4 height but can grow
  const pageStyle: React.CSSProperties = {
    width: `${A4_WIDTH_PX}px`,
    minHeight: `${A4_HEIGHT_PX}px`,
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div className="cv-preview-container" style={containerStyle}>
      <style dangerouslySetInnerHTML={{ __html: htmlContentStyles }} />

      <div
        ref={contentRef}
        className="bg-white"
        style={{
          ...pageStyle,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div style={{ padding: "0.4in" }}>
          {/* Header Section */}
          <div className="text-center mb-4">
            <h1
              className="font-bold uppercase tracking-wide mb-1"
              style={{ fontSize: fontSize.name, letterSpacing: "0.8px" }}
            >
              {data.personalData.name || "Nama Lengkap"}
            </h1>

            <div
              className="flex justify-center flex-wrap text-gray-600"
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
            <div className="mb-3">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.summary || "Summary"}
              </h2>
              <div
                className="pl-3 html-content"
                style={{ fontSize: fontSize.body }}
                dangerouslySetInnerHTML={{ __html: data.summary }}
              />
            </div>
          )}

          {/* Education Section */}
          {data.educations && data.educations.filter(hasEducationContent).length > 0 && (
            <div className="mb-3">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.education || "Education"}
              </h2>
              {data.educations.filter(hasEducationContent).map((edu, index) => (
                <div key={edu.id || index} className="mb-2.5 pl-3">
                  <div
                    className="flex justify-between items-baseline mb-0.5"
                    style={{ fontSize: fontSize.body }}
                  >
                    <div className="font-bold">
                      {edu.institution}
                      {edu.location && (
                        <span className="text-gray-500"> - {edu.location}</span>
                      )}
                    </div>
                    <div
                      className="whitespace-nowrap"
                      style={{ fontSize: fontSize.date }}
                    >
                      {getDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                    </div>
                  </div>
                  <div className="italic mb-1" style={{ fontSize: fontSize.body }}>
                    {edu.degree} in {edu.major}
                    {edu.gpa && `, GPA: ${edu.gpa}${edu.maxGpa ? `/${edu.maxGpa}` : ""}`}
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
            <div className="mb-3">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.workExperience || "Work Experience"}
              </h2>
              {data.workExperiences.filter(hasWorkExperienceContent).map((exp, index) => (
                <div key={exp.id || index} className="mb-2.5 pl-3">
                  <div
                    className="flex justify-between items-baseline mb-0.5"
                    style={{ fontSize: fontSize.body }}
                  >
                    <div className="font-bold">
                      {exp.company}
                      {exp.location && <span className="text-gray-500"> - {exp.location}</span>}
                    </div>
                    <div
                      className="whitespace-nowrap"
                      style={{ fontSize: fontSize.date }}
                    >
                      {getDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </div>
                  </div>
                  <div className="italic mb-1" style={{ fontSize: fontSize.body }}>
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
              <div className="mb-3">
                <h2
                  className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                  style={{ fontSize: fontSize.sectionTitle }}
                >
                  {data.sectionTitles?.organization || "Organisational Experience"}
                </h2>
                {data.organizationExperiences.filter(hasOrganizationContent).map((org, index) => (
                  <div key={org.id || index} className="mb-2.5 pl-3">
                    <div
                      className="flex justify-between items-baseline mb-0.5"
                      style={{ fontSize: fontSize.body }}
                    >
                      <div className="font-bold">{org.organization}</div>
                      <div
                        className="whitespace-nowrap"
                        style={{ fontSize: fontSize.date }}
                      >
                        {getDateRange(org.startDate, org.endDate, org.isCurrent)}
                      </div>
                    </div>
                    <div className="italic mb-1" style={{ fontSize: fontSize.body }}>
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
            <div className="mb-3">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.projects || "Projects"}
              </h2>
              {data.personalProjects.filter(hasProjectContent).map((project, index) => (
                <div key={project.id || index} className="mb-2.5 pl-3">
                  <div
                    className="flex justify-between items-baseline mb-0.5"
                    style={{ fontSize: fontSize.body }}
                  >
                    <div className="font-bold">{project.name}</div>
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
              <div key={section.sectionKey} className="mb-3">
                <h2
                  className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                  style={{ fontSize: fontSize.sectionTitle }}
                >
                  {section.sectionTitle || "Untitled"}
                </h2>
                {section.items.filter(item => item.title?.trim()).map((item, index) => (
                  <div key={item.id || index} className="mb-2.5 pl-3">
                    <div
                      className="flex justify-between items-baseline mb-0.5"
                      style={{ fontSize: fontSize.body }}
                    >
                      <div className="font-bold">
                        {item.title}
                      </div>
                      {item.years && (
                        <div
                          className="whitespace-nowrap"
                          style={{ fontSize: fontSize.date }}
                        >
                          {item.years}
                        </div>
                      )}
                    </div>
                    {item.subtitle && (
                      <div className="italic mb-1" style={{ fontSize: fontSize.body }}>
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
            <div className="mb-3">
              <h2
                className="font-bold border-b-2 border-black pb-0.5 pl-1 mb-2"
                style={{ fontSize: fontSize.sectionTitle }}
              >
                {data.sectionTitles?.others || "Skills, Achievements & Other Experience"}
              </h2>
              <ul className="pl-6 space-y-0.5" style={{ fontSize: fontSize.body, listStyleType: "disc" }}>
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
