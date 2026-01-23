import { NextRequest, NextResponse } from "next/server";
// import { FormDataSchema } from "@/lib/dto/cv.schema";
import type { FormData } from "@/types/editor-form-data";
import { CVService } from "@/lib/services/cv.service";
import { logger, logError } from "@/lib/log/logger";
import { requireUser } from "@/lib/auth/auth-server-helper";

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

    const formData = body as FormData;

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
