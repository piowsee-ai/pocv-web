/**
 * PDF Generation Service
 * Uses Puppeteer to render HTML templates to PDF
 * 
 * Browser Strategy:
 * - Development: Uses 'puppeteer' package which bundles Chromium (no hardcoded paths)
 * - Production: Uses 'puppeteer-core' + '@sparticuz/chromium' for serverless environments
 */

import type { Browser, PDFOptions } from "puppeteer-core";
import nunjucks from "nunjucks";
import { readFileSync } from "fs";
import { join } from "path";
import type { FormData } from "@/types/editor-form-data";

// Configure Nunjucks
const templatesDir = join(process.cwd(), "src/app/templates/html");
nunjucks.configure(templatesDir, {
  autoescape: false, // Allow HTML content to be rendered properly (e.g., descriptionHtml)
  trimBlocks: true,
  lstripBlocks: true,
});

// Cache CSS content (disabled in development for hot reload)
let cachedCSS: string | null = null;

function getCSS(): string {
  // Always reload in development
  if (process.env.NODE_ENV === "development") {
    const cssPath = join(process.cwd(), "src/app/templates/css/resume.css");
    return readFileSync(cssPath, "utf-8");
  }
  if (!cachedCSS) {
    const cssPath = join(process.cwd(), "src/app/templates/css/resume.css");
    cachedCSS = readFileSync(cssPath, "utf-8");
  }
  return cachedCSS;
}

// Cache HTML template (disabled in development for hot reload)
let cachedTemplate: string | null = null;

function getTemplate(): string {
  // Always reload in development
  if (process.env.NODE_ENV === "development") {
    const templatePath = join(templatesDir, "resume_en.html");
    return readFileSync(templatePath, "utf-8");
  }
  if (!cachedTemplate) {
    const templatePath = join(templatesDir, "resume_en.html");
    cachedTemplate = readFileSync(templatePath, "utf-8");
  }
  return cachedTemplate;
}

interface PDFGenerationOptions {
  isPreview?: boolean;
  format?: "F4";
}

// Browser singleton for reuse (important for serverless)
let browserInstance: Browser | null = null;

/**
 * Get browser instance based on environment
 * - Development: Uses full 'puppeteer' package with bundled Chromium
 * - Production: Uses 'puppeteer-core' + '@sparticuz/chromium' for serverless
 * 
 * This approach eliminates hardcoded paths and works consistently across environments.
 */
async function getBrowser(): Promise<Browser> {
  if (browserInstance) {
    return browserInstance;
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Production: Use puppeteer-core with @sparticuz/chromium for serverless
    const puppeteerCore = await import("puppeteer-core");
    const chromium = await import("@sparticuz/chromium");

    browserInstance = await puppeteerCore.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  } else {
    // Development: Use full puppeteer package with bundled Chromium (no hardcoded paths!)
    const puppeteer = await import("puppeteer");

    browserInstance = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    }) as unknown as Browser;
  }

  return browserInstance;
}

/**
 * Convert description to array format for template rendering
 */
function normalizeDescription(description: string | string[] | undefined): string[] {
  if (!description) return [];
  if (Array.isArray(description)) {
    return description.filter(item => item.trim());
  }
  if (typeof description === "string" && description.trim()) {
    // Split by newlines and filter empty lines
    return description.split("\n").filter(line => line.trim());
  }
  return [];
}

/**
 * Format date from YYYY-MM to "Mon YYYY" format
 */
function formatDate(dateStr: string, isCurrent?: boolean): string {
  if (isCurrent) return "Present";
  if (!dateStr) return "";

  // Handle YYYY-MM format
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
}

/**
 * Filter empty entries from data before rendering and format dates
 */
function filterEmptyEntries(data: FormData): FormData & { formattedDates: Record<string, string> } {
  return {
    ...data,
    // Filter educations - only include if institution, degree, or major is present
    // Also normalize description to array format and format dates
    educations: data.educations?.filter(
      (edu) => edu.institution?.trim() || edu.degree?.trim() || edu.major?.trim()
    ).map(edu => ({
      ...edu,
      description: normalizeDescription(edu.description),
      startDate: formatDate(edu.startDate),
      endDate: edu.isCurrent ? "Present" : formatDate(edu.endDate),
    })) || [],
    // Filter work experiences - only include if company or position is present
    workExperiences: data.workExperiences?.filter(
      (exp) => exp.company?.trim() || exp.position?.trim()
    ).map(exp => ({
      ...exp,
      description: normalizeDescription(exp.description),
      startDate: formatDate(exp.startDate),
      endDate: exp.isCurrent ? "Present" : formatDate(exp.endDate),
    })) || [],
    // Filter organization experiences - only include if organization or position is present
    organizationExperiences: data.organizationExperiences?.filter(
      (org) => org.organization?.trim() || org.position?.trim()
    ).map(org => ({
      ...org,
      description: normalizeDescription(org.description),
      startDate: formatDate(org.startDate),
      endDate: org.isCurrent ? "Present" : formatDate(org.endDate),
    })) || [],
    // Filter personal projects - only include if name is present
    personalProjects: data.personalProjects?.filter(
      (project) => project.name?.trim()
    ).map(project => ({
      ...project,
      description: normalizeDescription(project.description),
      startDate: project.startDate ? formatDate(project.startDate) : "",
      endDate: project.isCurrent ? "Present" : (project.endDate ? formatDate(project.endDate) : ""),
    })) || [],
    // Filter additional info - remove empty strings
    additional: {
      skills: data.additional?.skills?.filter((s) => s.trim()) || [],
      languages: data.additional?.languages?.filter((l) => l.trim()) || [],
      certifications: data.additional?.certifications?.filter((c) => c.trim()) || [],
      achievements: data.additional?.achievements?.filter((a) => a.trim()) || [],
    },
    // Filter and format custom sections
    customSections: data.customSections?.filter(
      (section) => section.items?.some((item) => item.title?.trim())
    ).map(section => ({
      ...section,
      items: section.items?.filter((item) => item.title?.trim()).map(item => ({
        ...item,
        startDate: item.startDate ? formatDate(item.startDate) : "",
        endDate: item.isCurrent ? "Present" : (item.endDate ? formatDate(item.endDate) : ""),
      })) || [],
    })) || [],
    // Provide formatted dates helper
    formattedDates: {},
  };
}

/**
 * Render resume data to HTML using Nunjucks template
 */
export function renderHTML(
  data: FormData,
  options?: PDFGenerationOptions
): string {
  const template = getTemplate();
  const css = getCSS();

  // Filter out empty entries before rendering
  const filteredData = filterEmptyEntries(data);

  // Inject CSS inline into the template
  const htmlWithCSS = template.replace(
    '<link rel="stylesheet" href="static/css/resume.css" />',
    `<style>${css}</style>`
  );

  // Render with Nunjucks
  const html = nunjucks.renderString(htmlWithCSS, {
    data: filteredData,
    is_preview: options?.isPreview ?? false,
  });

  return html;
}

/**
 * Generate PDF from resume data
 */
export async function generatePDF(
  data: FormData,
  options?: PDFGenerationOptions
): Promise<Buffer> {
  const html = renderHTML(data, options);
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // PDF options based on format
    const pdfOptions: PDFOptions = {
      format: options?.format === "F4" ? undefined : (options?.format ?? "A4"),
      printBackground: true,
      margin: {
        top: "0.3in",
        right: "0.3in",
        bottom: "0.3in",
        left: "0.3in",
      },
    };

    // F4 size
    if (options?.format === "F4") {
      pdfOptions.width = "8.28in";
      pdfOptions.height = "11.71in";
    }

    const pdfBuffer = await page.pdf(pdfOptions);

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

/**
 * Cleanup browser instance (call on app shutdown)
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Clear template and CSS cache
 */
export function clearCache(): void {
  cachedCSS = null;
  cachedTemplate = null;
}
