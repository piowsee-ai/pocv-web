/**
 * Resume Enhancement Service
 */

import { chat, LLMProvider, LLMConfig } from "@/lib/llm";
import { RESUME_ENHANCEMENT_PROMPT } from "@/lib/llm/prompts";
import type { FormData } from "@/types/form-data";

export interface EnhancedFormData extends FormData {
  enhancedEducations: { description: string }[];
  enhancedWorkExperiences: { description: string }[];
  enhancedOrganizationExperiences: { description: string }[];
}

interface EnhanceOptions {
  provider?: LLMProvider;
  model?: string;
  language?: "en" | "id";
}

async function enhanceDescription(
  description: string,
  context: string,
  config?: Partial<LLMConfig>
): Promise<string> {
  if (!description.trim()) {
    return description;
  }

  const response = await chat(
    [
      { role: "system", content: RESUME_ENHANCEMENT_PROMPT },
      {
        role: "user",
        content: `Context: ${context}\n\nOriginal description:\n${description}\n\nPlease enhance this description into professional bullet points.`,
      },
    ],
    config
  );

  return response.content;
}

/**
 * Enhance all descriptions in a resume form data
 */
export async function enhanceResume(
  formData: FormData,
  options?: EnhanceOptions
): Promise<EnhancedFormData> {
  const config: Partial<LLMConfig> = {
    provider: options?.provider,
    model: options?.model,
    temperature: 0.7,
  };

  // Enhance educations
  const enhancedEducations = await Promise.all(
    formData.educations.map(async (edu) => {
      const context = `Education at ${edu.institution}, studying ${edu.major} for ${edu.degree} degree`;
      const enhanced = await enhanceDescription(edu.description, context, config);
      return { description: enhanced };
    })
  );

  // Enhance work experiences
  const enhancedWorkExperiences = await Promise.all(
    formData.workExperiences.map(async (work) => {
      const context = `Work experience as ${work.position} at ${work.company}`;
      const enhanced = await enhanceDescription(work.description, context, config);
      return { description: enhanced };
    })
  );

  // Enhance organization experiences
  const enhancedOrganizationExperiences = await Promise.all(
    formData.organizationExperiences.map(async (org) => {
      const context = `Organization experience as ${org.position} at ${org.organization}`;
      const enhanced = await enhanceDescription(org.description, context, config);
      return { description: enhanced };
    })
  );

  return {
    ...formData,
    enhancedEducations,
    enhancedWorkExperiences,
    enhancedOrganizationExperiences,
  };
}

/**
 * Convert enhanced form data to template-ready format
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
      description: enhanced.enhancedEducations[i]?.description || edu.description,
    })),
    work_experience: workExperiences.map((work, i) => ({
      company: work.company,
      location: work.city,
      position: work.position,
      start_date: work.startDate,
      end_date: work.endDate,
      description: enhanced.enhancedWorkExperiences[i]?.description || work.description,
    })),
    organizations: organizationExperiences.map((org, i) => ({
      organization: org.organization,
      location: org.location,
      position: org.position,
      start_date: org.startDate,
      end_date: org.endDate,
      description: enhanced.enhancedOrganizationExperiences[i]?.description || org.description,
    })),
  };
}
