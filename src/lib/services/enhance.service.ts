/**
 * Resume Enhancement Service
 */

import { chat, LLMProvider, LLMConfig } from "@/lib/llm";
import { RESUME_ENHANCEMENT_PROMPT, ResumeLanguage } from "@/lib/llm/prompts";
import type { FormData } from "@/types/form-data";

export interface EnhancedFormData extends FormData {
  enhancedEducations: { description: string[] }[];
  enhancedWorkExperiences: { description: string[] }[];
  enhancedOrganizationExperiences: { description: string[] }[];
}

interface EnhanceOptions {
  provider?: LLMProvider;
  model?: string;
  language?: ResumeLanguage;
}

function resumeToString(formData: FormData): string {
  return JSON.stringify(formData, null, 2);
}

/**
 * Enhance all descriptions in a resume form data
 */
export async function enhanceResume(formData: FormData, options?: EnhanceOptions): Promise<EnhancedFormData> {
  const config: Partial<LLMConfig> = {
    provider: options?.provider,
    model: options?.model,
    temperature: 0.7,
  };

  const language = options?.language ?? "en";
  const resumeDataStr = resumeToString(formData);

  const prompt = RESUME_ENHANCEMENT_PROMPT(resumeDataStr, language);

  const response = await chat(
    [{ role: "user", content: prompt }],
    config
  );

  // Parse the JSON response
  const enhanced = JSON.parse(response.content.trim());

  // Map enhanced data back to our format
  const enhancedEducations = formData.educations.map((_, i) => ({
    description: enhanced.educations[i]?.description || [],
  }));

  const enhancedWorkExperiences = formData.workExperiences.map((_, i) => ({
    description: enhanced.workExperiences[i]?.description || [],
  }));

  const enhancedOrganizationExperiences = formData.organizationExperiences.map((_, i) => ({
    description: enhanced.organizationExperiences[i]?.description || [],
  }));

  return {
    ...formData,
    enhancedEducations,
    enhancedWorkExperiences,
    enhancedOrganizationExperiences,
  };
}

/**
 * Convert enhanced form data to resume format (TODO: needed change based on the structure)
 */
export function toTemplateData(enhanced: EnhancedFormData) {
  const { personalData, educations, workExperiences, organizationExperiences } = enhanced;

  return {
    name: personalData.name,
    phone: personalData.phone,
    email: personalData.email,
    linkedin: personalData.linkedin,
    github: personalData.github,
    education: educations.map((edu, i) => ({
      institution: edu.institution,
      location: edu.location,
      degree: `${edu.degree} in ${edu.major}`,
      gpa: edu.gpa ? `GPA: ${edu.gpa}` : undefined,
      start_date: edu.startDate,
      end_date: edu.endDate,
      description: enhanced.enhancedEducations[i]?.description || [],
    })),
    work_experience: workExperiences.map((work, i) => ({
      company: work.company,
      location: work.city,
      position: work.position,
      start_date: work.startDate,
      end_date: work.endDate,
      description: enhanced.enhancedWorkExperiences[i]?.description || [],
    })),
    organizations: organizationExperiences.map((org, i) => ({
      organization: org.organization,
      location: org.location,
      position: org.position,
      start_date: org.startDate,
      end_date: org.endDate,
      description: enhanced.enhancedOrganizationExperiences[i]?.description || [],
    })),
  };
}
