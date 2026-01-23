import { NextRequest, NextResponse } from "next/server";
import { FormDataSchema } from "@/lib/dto/cv.schema";
import type { FormData } from "@/types/form-data";
import { CVService } from "@/lib/services/cv.service";
import { logger, logError } from "@/lib/log/logger";
import { requireUser } from "@/lib/auth/auth-server-helper";

export async function POST(req: NextRequest) {
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

    const formData = result.data as unknown as FormData;
    await CVService.createCV(userId, formData);

    logger.info("CV created successfully", {
      userId,
      method: req.method,
      route: req.url,
    });
    return NextResponse.json(
      {
        success: true,
        message: "CV created",
      },
      { status: 201 }
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
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
