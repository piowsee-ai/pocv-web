/**
 * PDF Generation Service
 * Uses Puppeteer to render HTML templates to PDF
 */

import puppeteer, { Browser, PDFOptions } from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import nunjucks from "nunjucks";
import { readFileSync } from "fs";
import { join } from "path";
import type { FormData } from "@/types/form-data";

// Configure Nunjucks
const templatesDir = join(process.cwd(), "src/app/templates/html");
nunjucks.configure(templatesDir, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});

// Cache CSS content
let cachedCSS: string | null = null;

function getCSS(): string {
  if (!cachedCSS) {
    const cssPath = join(process.cwd(), "src/app/templates/css/resume.css");
    cachedCSS = readFileSync(cssPath, "utf-8");
  }
  return cachedCSS;
}

// Cache HTML template
let cachedTemplate: string | null = null;

function getTemplate(): string {
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

async function getBrowser(): Promise<Browser> {
  if (browserInstance) {
    return browserInstance;
  }

  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) {
    // For local development, use system Chrome/Chromium
    const executablePath =
      process.env.CHROME_PATH ||
      "/usr/bin/google-chrome" ||
      "/usr/bin/chromium-browser" ||
      "/usr/bin/chromium";

    browserInstance = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } else {
    // For production (serverless), use @sparticuz/chromium
    browserInstance = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  return browserInstance;
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

  // Inject CSS inline into the template
  const htmlWithCSS = template.replace(
    '<link rel="stylesheet" href="static/css/resume.css" />',
    `<style>${css}</style>`
  );

  // Render with Nunjucks
  const html = nunjucks.renderString(htmlWithCSS, {
    data,
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
