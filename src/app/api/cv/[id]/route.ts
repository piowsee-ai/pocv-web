import { NextRequest, NextResponse } from "next/server";
import { FormDataDTO, FormDataSchema } from "@/lib/dto/cv.schema";
import { CVService } from "@/lib/services/cv.service";
import { logger, logError } from "@/lib/log/logger";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/cv/[id]">) {
  // TODO: replace with actual authenticated userId
  const { id } = await ctx.params;
  const userId = "user-1";

  try {
    const cvs: FormDataDTO | null = await CVService.getCVDetail(id, userId);

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
  } catch (err) {
    logError(err, { userId, cvId: id, method: req.method, route: req.url });
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
  ctx: RouteContext<"/api/cv/[id]">
) {
  // TODO: replace with actual authenticated userId
  const { id } = await ctx.params;
  const userId = "user-1";

  try {
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

    const formData: FormDataDTO = result.data;

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
  } catch (err) {
    logError(err, { userId, cvId: id, method: req.method, route: req.url });
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
