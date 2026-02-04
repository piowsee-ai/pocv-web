import { NextRequest, NextResponse } from "next/server";
// import { FormDataSchema } from "@/lib/dto/cv.schema";
import type { FormData } from "@/types/editor-form-data";
import { CVService } from "@/lib/services/cv.service";
import { logger, logError } from "@/lib/log/logger";
import { requireUser } from "@/lib/auth/auth-server-helper";
import {
  MAX_LENGTH,
  sanitizeName,
  sanitizePhone,
  truncateToMaxLength,
} from "@/lib/validation/editor-validation";

/**
 * Server-side sanitization for CV form data
 * Applies maxLength truncation and character sanitization to prevent
 * large payloads and injection attacks
 */
function sanitizeFormData(data: FormData): FormData {
  const sanitized = { ...data };

  // Sanitize personalData
  if (sanitized.personalData) {
    sanitized.personalData = {
      ...sanitized.personalData,
      name: truncateToMaxLength(sanitizeName(sanitized.personalData.name || ""), MAX_LENGTH.NAME),
      phone: truncateToMaxLength(sanitizePhone(sanitized.personalData.phone || ""), MAX_LENGTH.PHONE),
      email: truncateToMaxLength(sanitized.personalData.email || "", MAX_LENGTH.EMAIL),
      location: truncateToMaxLength(sanitized.personalData.location || "", MAX_LENGTH.LOCATION),
      linkedin: truncateToMaxLength(sanitized.personalData.linkedin || "", MAX_LENGTH.URL),
      github: truncateToMaxLength(sanitized.personalData.github || "", MAX_LENGTH.URL),
      website: truncateToMaxLength(sanitized.personalData.website || "", MAX_LENGTH.URL),
    };
  }

  // Sanitize summary (plain text description limit applies to HTML content as well)
  // Note: We truncate the HTML for safety, actual character count is handled by frontend
  if (sanitized.summary && sanitized.summary.length > MAX_LENGTH.DESCRIPTION * 5) {
    // If HTML is extremely large (5x description limit), truncate it
    sanitized.summary = sanitized.summary.slice(0, MAX_LENGTH.DESCRIPTION * 5);
  }

  // Sanitize educations
  if (sanitized.educations) {
    sanitized.educations = sanitized.educations.map((edu) => ({
      ...edu,
      institution: truncateToMaxLength(edu.institution || "", MAX_LENGTH.INSTITUTION),
      degree: truncateToMaxLength(edu.degree || "", MAX_LENGTH.DEGREE),
      major: truncateToMaxLength(edu.major || "", MAX_LENGTH.MAJOR),
      location: truncateToMaxLength(edu.location || "", MAX_LENGTH.LOCATION),
    }));
  }

  // Sanitize workExperiences
  if (sanitized.workExperiences) {
    sanitized.workExperiences = sanitized.workExperiences.map((work) => ({
      ...work,
      position: truncateToMaxLength(work.position || "", MAX_LENGTH.POSITION),
      company: truncateToMaxLength(work.company || "", MAX_LENGTH.COMPANY),
      location: truncateToMaxLength(work.location || "", MAX_LENGTH.LOCATION),
    }));
  }

  // Sanitize organizationExperiences
  if (sanitized.organizationExperiences) {
    sanitized.organizationExperiences = sanitized.organizationExperiences.map((org) => ({
      ...org,
      position: truncateToMaxLength(org.position || "", MAX_LENGTH.POSITION),
      organization: truncateToMaxLength(org.organization || "", MAX_LENGTH.ORGANIZATION),
    }));
  }

  // Sanitize personalProjects
  if (sanitized.personalProjects) {
    sanitized.personalProjects = sanitized.personalProjects.map((proj) => ({
      ...proj,
      name: truncateToMaxLength(proj.name || "", MAX_LENGTH.NAME),
      role: truncateToMaxLength(proj.role || "", MAX_LENGTH.ROLE),
    }));
  }

  // Sanitize customSections
  if (sanitized.customSections) {
    sanitized.customSections = sanitized.customSections.map((section) => ({
      ...section,
      items: section.items?.map((item) => ({
        ...item,
        title: truncateToMaxLength(item.title || "", MAX_LENGTH.TITLE),
        subtitle: truncateToMaxLength(item.subtitle || "", MAX_LENGTH.SUBTITLE),
      })) || [],
    }));
  }

  return sanitized;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  let userId: string | undefined;

  try {
    userId = await requireUser();
    const cvs: FormData | null = await CVService.getCVDetail(id, userId);

    if (!cvs) {
      logger.warn("CV Detail not found", {
        userId,
        cvId: id,
        method: req.method,
        route: req.url,
      });
      return NextResponse.json(
        {
          success: false,
          message: "CV Detail not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cvs }, { status: 200 });
  } catch (err: any) {
    logError(err, {
      userId,
      method: req.method,
      route: req.url,
    });
    if (err.status) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  let userId: string | undefined;

  try {
    userId = await requireUser();
    const body = await req.json();

    // For editor, we skip strict validation to allow partial/empty data
    // The editor is meant to be flexible - users can save drafts with missing data
    // Basic sanity check: ensure body is an object with personalData
    if (!body || typeof body !== "object" || !body.personalData) {
      logger.warn("CV update failed - invalid body structure", {
        userId,
        cvId: id,
        method: req.method,
        route: req.url,
      });
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Apply server-side sanitization to prevent large payloads and injection attacks
    const formData = sanitizeFormData(body as FormData);

    // Debug: Log descriptionHtml to ensure it's being sent
    logger.info("CV update data check", {
      userId,
      cvId: id,
      hasEducations: formData.educations?.length || 0,
      firstEduDescHtml: formData.educations?.[0]?.descriptionHtml?.substring(0, 50) || "none",
      firstEduDesc: typeof formData.educations?.[0]?.description,
    });

    // NOTE: Decide whether to return the updated CV (with sections) or keep it fire-and-forget
    const updatedCV = await CVService.updateCV(id, userId, formData);

    logger.info("CV updated successfully", {
      userId,
      cvId: id,
      method: req.method,
      route: req.url,
    });
    return NextResponse.json(
      { success: true, message: "CV Updated Successfully", data: updatedCV },
      { status: 200 }
    );
  } catch (err: any) {
    logError(err, {
      userId,
      method: req.method,
      route: req.url,
    });
    if (err.status) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST handler for sendBeacon (browser leave save)
// sendBeacon can only use POST, so we provide this endpoint
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  // Reuse PATCH logic for consistency
  return PATCH(req, ctx);
}

