import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CVService } from "@/lib/services/cv.service";
import type { CVList } from "@/types/cv";
import { logError } from "@/lib/log/logger";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const cvs: CVList[] = await CVService.getAllCVByUserId(userId);
    return NextResponse.json({ success: true, data: cvs }, { status: 200 });
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
