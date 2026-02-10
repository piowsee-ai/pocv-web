import { NextRequest, NextResponse } from "next/server";
import { generatePDF } from "@/lib/services/generate.service";
import { logger, logError } from "@/lib/log/logger";
import { requireUser } from "@/lib/auth/auth-server-helper";
import { CVService } from "@/lib/services/cv.service";
import type { FormData } from "@/types/editor-form-data";

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  let userId: string | undefined;

  try {
    userId = await requireUser();

    // Get CV data from database
    const cvData: FormData | null = await CVService.getCVDetail(id, userId);

    if (!cvData) {
      logger.warn("CV not found for download", {
        userId,
        cvId: id,
        method: req.method,
        route: req.url,
      });
      return NextResponse.json(
        { success: false, message: "CV not found" },
        { status: 404 }
      );
    }

    logger.info("Starting PDF generation for download", {
      userId,
      cvId: id,
      hasEducations: cvData.educations?.length || 0,
      firstEduDescHtml: cvData.educations?.[0]?.descriptionHtml?.substring(0, 50) || "none",
    });

    // Generate PDF from CV data
    const pdfBuffer = await generatePDF(cvData, {
      isPreview: false,
      format: "F4",
    });

    logger.info("PDF generated successfully", {
      userId,
      cvId: id,
      pdfSize: pdfBuffer.length,
    });

    // Return PDF as downloadable file
    const fileName = cvData.personalData?.name
      ? `CV-${cvData.personalData.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
      : `CV-${Date.now()}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    logError(error, {
      userId,
      cvId: id,
      method: req.method,
      route: req.url,
    });

    if (error.status) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate PDF. Please try again.",
      },
      { status: 500 }
    );
  }
}
