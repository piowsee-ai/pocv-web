import { NextRequest, NextResponse } from "next/server";
import type { FormData } from "@/types/editor-form-data";
import { CVService } from "@/lib/services/cv.service";
import { logger, logError } from "@/lib/log/logger";
import { requireUser } from "@/lib/auth/auth-server-helper";
import { FormDataSchema } from "@/lib/schemas/cv.schema";

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

    const result = FormDataSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.warn("Create CV validation failed", {
        userId,
        errors,
        method: req.method,
        route: req.url,
      });
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const formData: FormData = result.data;

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

