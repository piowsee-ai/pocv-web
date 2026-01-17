import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { FormDataSchema } from "@/lib/dto/cv.schema";
import { enhanceResume } from "@/lib/services/enhance.service";
import { generatePDF } from "@/lib/services/generate.service";
import { logger, logError } from "@/lib/log/logger";
import { LLMProvider, getDefaultProvider } from "@/lib/llm";

export const maxDuration = 300;

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
    
    // Extract options from request
    const { formData: rawFormData, options } = body as {
      formData: unknown;
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

    const formData = result.data;

    logger.info("Starting CV generation", {
      userId,
      provider: options?.provider ?? getDefaultProvider(),
      isPreview: options?.isPreview ?? false,
    });

    // Step 1: Enhance resume content with AI
    const enhancedData = await enhanceResume(formData, {
      provider: options?.provider,
    });

    // Step 2: Generate PDF directly from enhanced data
    const pdfBuffer = await generatePDF(enhancedData, {
      isPreview: options?.isPreview,
      format: "F4",
    });

    logger.info("CV generated successfully", {
      userId,
      pdfSize: pdfBuffer.length,
    });

    // Return PDF as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${Date.now()}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    logError(error, {
      userId,
      method: req.method,
      route: req.url,
    });
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate CV. Please try again.",
      },
      { status: 500 }
    );
  }
}
