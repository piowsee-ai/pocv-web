/**
 * Resume Enhancement Service
 */

import { chat, LLMProvider, LLMConfig } from "@/lib/llm";
import { RESUME_ENHANCEMENT_PROMPT, ResumeLanguage } from "@/lib/llm/prompts";
import type { FormData } from "@/types/form-data";

export type EnhancedFormData = FormData;

interface EnhanceOptions {
  provider?: LLMProvider;
  model?: string;
  language?: ResumeLanguage;
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

  const prompt = RESUME_ENHANCEMENT_PROMPT(JSON.stringify(formData, null, 2), language);

  const response = await chat([{ role: "user", content: prompt }], config);

  return JSON.parse(response.content.trim());
}

/**
 * Convert enhanced form data to resume format (TODO: needed change based on the structure)
 */
export function toTemplateData(data: EnhancedFormData) {
  const {
    personalData,
    summary,
    educations,
    workExperiences,
    organizationExperiences,
    personalProjects,
    additional,
    customSections,
  } = data;

  return {
    // Personal data
    name: personalData.name,
    phone: personalData.phone,
    email: personalData.email,
    location: personalData.location,
    website: personalData.website,
    linkedin: personalData.linkedin,
    github: personalData.github,

    // Summary
    summary,

    // Education
    education: educations.map((edu) => ({
      institution: edu.institution,
      location: edu.location,
      degree: `${edu.degree} in ${edu.major}`,
      gpa: edu.gpa ? `GPA: ${edu.gpa}` : undefined,
      start_date: edu.startDate,
      end_date: edu.endDate,
      description: edu.description,
    })),

    // Work experience
    work_experience: workExperiences.map((work) => ({
      company: work.company,
      location: work.location,
      position: work.position,
      start_date: work.startDate,
      end_date: work.endDate,
      description: work.description,
    })),

    // Organizations
    organizations: organizationExperiences.map((org) => ({
      organization: org.organization,
      position: org.position,
      start_date: org.startDate,
      end_date: org.endDate,
      description: org.description,
    })),

    // Personal projects
    projects: personalProjects?.map((project) => ({
      name: project.name,
      description: project.description,
    })),

    // Additional info
    skills: additional?.skills,
    languages: additional?.languages,
    certifications: additional?.certifications,
    achievements: additional?.achievements,

    // Custom sections
    customSections,
  };
}
