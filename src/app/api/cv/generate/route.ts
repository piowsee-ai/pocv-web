import { NextRequest, NextResponse } from "next/server";
import { FormDataSchema } from "@/schemas/cv.schema";
import { enhanceResume } from "@/services/enhance.service";
import { logger, logError } from "@/lib/log/logger";
import { LLMProvider, getDefaultProvider } from "@/lib/llm";
import type { FormData } from "@/types/form-data";
import { requireUser } from "@/lib/auth/auth-server-helper";
import { CVService } from "@/services/cv.service";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let userId: string | undefined;

  try {
    userId = await requireUser();
    const body = await req.json();

    // Extract options from request
    const { formData: rawFormData, options } = body as {
      formData: FormData;
      options?: {
        provider?: LLMProvider;
        isPreview?: boolean;
        format: "F4";
      };
    };

    // Validate form data
    const result = FormDataSchema.safeParse(rawFormData);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      logger.warn("Generate CV validation failed", {
        userId,
        errors,
        method: req.method,
        route: req.url,
      });
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const formData: FormData = result.data;

    logger.info("Starting CV generation", {
      userId,
      provider: options?.provider ?? getDefaultProvider(),
      isPreview: options?.isPreview ?? false,
    });

    // Step 1: pass to LLM
    const enhancedData = await enhanceResume(formData, {
      provider: options?.provider,
    });

    // Step 2: save to database
    const saved = await CVService.createCV(userId, enhancedData);

    logger.info("CV saved to database", {
      userId,
      cvId: saved.id,
    });

    return NextResponse.json({
      success: true,
      data: enhancedData,
      cvId: saved.id,
    });

    // Step 2: Generate PDF directly from enhanced data (temporarily disabled)
    // const pdfBuffer = await generatePDF(enhancedData, {
    //   isPreview: options?.isPreview,
    //   format: "F4",
    // });

    // logger.info("CV generated successfully", {
    //   userId,
    //   pdfSize: pdfBuffer.length,
    // });

    // // Return PDF as downloadable file
    // return new NextResponse(new Uint8Array(pdfBuffer), {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": `attachment; filename="resume-${Date.now()}.pdf"`,
    //     "Content-Length": pdfBuffer.length.toString(),
    //   },
    // });
  } catch (error: any) {
    logError(error, {
      userId,
      method: req.method,
      route: req.url,
    });
    if (error.status) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate CV. Please try again.",
      },
      { status: 500 },
    );
  }
}
