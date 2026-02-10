/**
 * Resume Enhancement Service
 */

import { chat, LLMProvider, LLMConfig } from "@/lib/llm";
import { RESUME_ENHANCEMENT_PROMPT, ResumeLanguage } from "@/lib/llm/prompts";
import type { FormData } from "@/types/form-data";

interface EnhanceOptions {
  provider?: LLMProvider;
  model?: string;
  language?: ResumeLanguage;
}

/**
 * Enhance all descriptions in a resume form data
 */
export async function enhanceResume(formData: FormData, options?: EnhanceOptions): Promise<FormData> {
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
