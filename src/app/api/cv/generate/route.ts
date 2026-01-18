import { NextRequest, NextResponse } from "next/server";
import { FormDataSchema } from "@/lib/dto/cv.schema";
import { enhanceResume } from "@/lib/services/enhance.service";
import { generatePDF } from "@/lib/services/generate.service";
import { logger, logError } from "@/lib/log/logger";
import { LLMProvider, getDefaultProvider } from "@/lib/llm";
import type { FormData } from "@/types/form-data";
import { v4 as uuidv4 } from "uuid";
import { requireUser } from "@/lib/auth/auth-server-helper";

export const maxDuration = 300;

function addIdsToFormData(data: FormData): FormData {
  return {
    ...data,
    educations: data.educations.map((item) => ({
      ...item,
      id: item.id ?? uuidv4(),
    })),
    workExperiences: data.workExperiences.map((item) => ({
      ...item,
      id: item.id ?? uuidv4(),
    })),
    organizationExperiences: data.organizationExperiences.map((item) => ({
      ...item,
      id: item.id ?? uuidv4(),
    })),
    personalProjects: data.personalProjects.map((item) => ({
      ...item,
      id: item.id ?? uuidv4(),
    })),
    customSections: data.customSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        id: item.id ?? uuidv4(),
      })),
    })),
  };
}

export async function POST(req: NextRequest) {
  let userId: string | undefined;

  try {
    userId = await requireUser();
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

    // Step 1: pass to LLM
    const enhancedData = await enhanceResume(formData, {
      provider: options?.provider,
    });

    // Step 2: add uuid
    const dataWithIds = addIdsToFormData(enhancedData);

    // TODO: remove the log and push to database
    console.log("=== LLM returns ===");
    console.log(JSON.stringify(dataWithIds, null, 2));
    
    return NextResponse.json({
      success: true,
      data: dataWithIds,
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
  } catch (error) {
    logError(error, {
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
        message: "Failed to generate CV. Please try again.",
      },
      { status: 500 }
    );
  }
}
