import { NextRequest, NextResponse } from "next/server";
import { FormDataSchema } from "@/lib/dto/cv.schema";
import type { FormData } from "@/types/form-data";
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
    const result = FormDataSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      logger.warn("CV update validation failed", {
        userId,
        cvId: id,
        errors,
        method: req.method,
        route: req.url,
      });
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const formData: FormData = result.data;

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
