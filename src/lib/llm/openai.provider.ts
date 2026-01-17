import OpenAI from "openai";
import {
  LLMProviderClient,
  LLMMessage,
  LLMResponse,
  LLMConfig,
  DEFAULT_CONFIGS,
} from "./types";

export class OpenAIProvider implements LLMProviderClient {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    this.client = new OpenAI({ apiKey });
  }

  async chat(messages: LLMMessage[], config?: Partial<LLMConfig>): Promise<LLMResponse> {
    const defaults = DEFAULT_CONFIGS.openai;
    const model = config?.model ?? defaults.model;
    const temperature = config?.temperature ?? defaults.temperature;
    const maxTokens = config?.maxTokens ?? defaults.maxTokens;

    // Build input string from messages
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");
    
    // Combine messages into input
    const input = userMessages.map((m) => m.content).join("\n\n");

    const response = await this.client.responses.create({
      model,
      instructions: systemMessage?.content,
      input,
      temperature,
      max_output_tokens: maxTokens,
    });

    // Extract text from response
    const outputText = response.output_text;
    if (!outputText) {
      throw new Error("No response content from OpenAI");
    }

    return {
      content: outputText,
      provider: "openai",
      model,
      usage: response.usage
        ? {
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens,
          }
        : undefined,
    };
  }
}
