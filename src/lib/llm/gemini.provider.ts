import { GoogleGenAI } from "@google/genai";
import {
  LLMProviderClient,
  LLMMessage,
  LLMResponse,
  LLMConfig,
  DEFAULT_CONFIGS,
} from "./types";

export class GeminiProvider implements LLMProviderClient {
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async chat(
    messages: LLMMessage[],
    config?: Partial<LLMConfig>
  ): Promise<LLMResponse> {
    const defaults = DEFAULT_CONFIGS.gemini;
    const model = config?.model ?? defaults.model;
    const temperature = config?.temperature ?? defaults.temperature;
    const maxTokens = config?.maxTokens ?? defaults.maxTokens;

    // Extract system instruction and user messages
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    // Build contents with system instruction included as first user message
    let fullContents = "";
    if (systemMessage?.content) {
      fullContents = `Instructions: ${systemMessage.content}\n\n`;
    }
    fullContents += userMessages.map((m) => m.content).join("\n\n");

    const response = await this.client.models.generateContent({
      model,
      contents: fullContents,
      config: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from Gemini");
    }

    return {
      content: text,
      provider: "gemini",
      model,
      usage: response.usageMetadata
        ? {
            promptTokens: response.usageMetadata.promptTokenCount ?? 0,
            completionTokens: response.usageMetadata.candidatesTokenCount ?? 0,
            totalTokens: response.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
    };
  }
}
