/**
 * Resume Improvement Service
 * Used to tailor resumes toward specific job descriptions
 */

import { chat, LLMProvider, LLMConfig } from "@/lib/llm";
import {
  EXTRACT_KEYWORDS_PROMPT,
  IMPROVE_RESUME_PROMPTS,
  TRUTHFUL_RULES,
  RESUME_SCHEMA,
  ResumeLanguage,
} from "@/lib/llm/prompts";
import type { FormData } from "@/types/form-data";

export type ImproveLevel = "nudge" | "keywords" | "full";

export type ImprovedFormData = FormData;

interface ExtractedKeywords {
  required_skills: string[];
  preferred_skills: string[];
  experience_requirements: string[];
  education_requirements: string[];
  key_responsibilities: string[];
  keywords: string[];
  experience_years: number;
  seniority_level: string;
}

interface ImproveOptions {
  provider?: LLMProvider;
  model?: string;
  language?: ResumeLanguage;
  level?: ImproveLevel;
}

/**
 * Extract keywords from a job description
 */
export async function extractKeywords(
  jobDescription: string,
  config?: Partial<LLMConfig>
): Promise<ExtractedKeywords> {
  const prompt = EXTRACT_KEYWORDS_PROMPT(jobDescription);

  // Use keywords schema for structured output
  const keywordsConfig: Partial<LLMConfig> = {
    ...config,
    responseSchema: "keywords",
  };

  const response = await chat([{ role: "user", content: prompt }], keywordsConfig);

  return JSON.parse(response.content.trim());
}

/**
 * Improve/tailor a resume toward a specific job description
 */
export async function improveResume(
  formData: FormData,
  jobDescription: string,
  options?: ImproveOptions
): Promise<ImprovedFormData> {
  const config: Partial<LLMConfig> = {
    provider: options?.provider,
    model: options?.model,
    temperature: 0.7,
  };

  const language = options?.language ?? "en";
  const level = options?.level ?? "keywords";

  // Step 1: Extract keywords from job description
  const keywords = await extractKeywords(jobDescription, config);

  // Step 2: Get the appropriate prompt and truthfulness rules
  const promptFn = IMPROVE_RESUME_PROMPTS[level];
  const truthRules = TRUTHFUL_RULES[level];

  // Step 3: Build the prompt with all parameters
  const prompt = promptFn(
    truthRules,
    language,
    RESUME_SCHEMA,
    JSON.stringify(formData, null, 2),
    jobDescription,
    JSON.stringify(keywords, null, 2)
  );

  // Step 4: Call LLM to improve the resume
  const response = await chat([{ role: "user", content: prompt }], config);

  return JSON.parse(response.content.trim());
}
