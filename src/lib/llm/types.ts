/**
 * LLM Provider Types
 */

export type LLMProvider = "openai" | "gemini";

export type ResponseSchemaType = "resume" | "keywords" | "none";

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseSchema?: ResponseSchemaType;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProviderClient {
  chat(messages: LLMMessage[], config?: Partial<LLMConfig>): Promise<LLMResponse>;
}

// Default configurations for each provider
export const DEFAULT_CONFIGS: Record<LLMProvider, { model: string; temperature: number; maxTokens: number }> = {
  openai: {
    model: "gpt-5-nano",
    temperature: 0.7,
    maxTokens: 2048,
  },
  gemini: {
    model: "gemini-2.5-flash",
    temperature: 0.7,
    maxTokens: 2048,
  },
};
