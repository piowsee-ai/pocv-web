import { NextRequest, NextResponse } from "next/server";
import { CVListDTO } from "@/lib/dto/cv.schema";
import { CVService } from "@/lib/services/cv.service";
import { logError } from "@/lib/log/logger";

export async function GET(req: NextRequest) {
  // TODO: replace with actual authenticated userId
  const userId = "user";

  try {
    const cvs: CVListDTO[] = await CVService.getAllCVByUserId(userId);
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
