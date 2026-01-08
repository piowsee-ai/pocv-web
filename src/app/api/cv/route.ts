import { NextRequest, NextResponse } from "next/server";
import { FormDataSchema } from "@/lib/dto/cv.schema";
import type { FormData } from "@/types/form-data";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CVService } from "@/lib/services/cv.service";
import { logger, logError } from "@/lib/log/logger";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
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
  } catch (err) {
    logError(err, { userId, method: req.method, route: req.url });
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
