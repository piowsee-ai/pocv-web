import { LLMProvider, LLMProviderClient, LLMConfig, LLMMessage, LLMResponse } from "./types";
import { OpenAIProvider } from "./openai.provider";
import { GeminiProvider } from "./gemini.provider";

// Singleton instances
const providerInstances: Partial<Record<LLMProvider, LLMProviderClient>> = {};

/**
 * Get an LLM provider client instance using singleton pattern
 */
export function getLLMProvider(provider: LLMProvider): LLMProviderClient {
  if (!providerInstances[provider]) {
    switch (provider) {
      case "openai":
        providerInstances[provider] = new OpenAIProvider();
        break;
      case "gemini":
        providerInstances[provider] = new GeminiProvider();
        break;
      default:
        throw new Error(`Unknown LLM provider: ${provider}`);
    }
  }
  return providerInstances[provider]!;
}

/**
 * Get the default LLM provider
 */
export function getDefaultProvider(): LLMProvider {
  const provider = process.env.DEFAULT_LLM_PROVIDER as LLMProvider | undefined;
  if (provider && ["openai", "gemini"].includes(provider)) {
    return provider;
  }
  // default to OpenAI if not specified
  return "openai";
}

/**
 * Function to chat with the provider
 */
export async function chat(messages: LLMMessage[], config?: Partial<LLMConfig>): Promise<LLMResponse> {
  const provider = config?.provider ?? getDefaultProvider();
  const client = getLLMProvider(provider);
  return client.chat(messages, config);
}

// Re-export types
export type { LLMProvider, LLMProviderClient, LLMConfig, LLMMessage, LLMResponse };
