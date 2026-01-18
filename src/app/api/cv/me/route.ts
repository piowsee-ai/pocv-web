import { NextRequest, NextResponse } from "next/server";
import { CVService } from "@/lib/services/cv.service";
import type { CVList } from "@/types/cv";
import { logError } from "@/lib/log/logger";
import { requireUser } from "@/lib/auth/auth-server-helper";

export async function GET(req: NextRequest) {
  let userId: string | undefined;

  try {
    userId = await requireUser();
    const cvs: CVList[] = await CVService.getAllCVByUserId(userId);
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
