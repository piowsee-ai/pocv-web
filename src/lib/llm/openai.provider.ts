import OpenAI from "openai";
import {
  LLMProviderClient,
  LLMMessage,
  LLMResponse,
  LLMConfig,
  DEFAULT_CONFIGS,
} from "./types";

const RESUME_JSON_SCHEMA = {
  name: "resume",
  strict: true,
  schema: {
    type: "object",
    properties: {
      personalData: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          location: { type: "string" },
          website: { type: "string" },
          linkedin: { type: "string" },
          github: { type: "string" },
        },
        required: ["name", "phone", "email", "location", "website", "linkedin", "github"],
        additionalProperties: false,
      },
      summary: { type: "string" },
      educations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            institution: { type: "string" },
            degree: { type: "string" },
            major: { type: "string" },
            location: { type: "string" },
            gpa: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            description: { type: "array", items: { type: "string" } },
          },
          required: ["id", "institution", "degree", "major", "location", "gpa", "startDate", "endDate", "description"],
          additionalProperties: false,
        },
      },
      workExperiences: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            position: { type: "string" },
            company: { type: "string" },
            location: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            description: { type: "array", items: { type: "string" } },
          },
          required: ["id", "position", "company", "location", "startDate", "endDate", "description"],
          additionalProperties: false,
        },
      },
      organizationExperiences: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            position: { type: "string" },
            organization: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            description: { type: "array", items: { type: "string" } },
          },
          required: ["id", "position", "organization", "startDate", "endDate", "description"],
          additionalProperties: false,
        },
      },
      personalProjects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            description: { type: "array", items: { type: "string" } },
          },
          required: ["id", "name", "description"],
          additionalProperties: false,
        },
      },
      additional: {
        type: "object",
        properties: {
          skills: { type: "array", items: { type: "string" } },
          languages: { type: "array", items: { type: "string" } },
          certifications: { type: "array", items: { type: "string" } },
          achievements: { type: "array", items: { type: "string" } },
        },
        required: ["skills", "languages", "certifications", "achievements"],
        additionalProperties: false,
      },
      customSections: {
        type: "object",
        additionalProperties: {
          type: "object",
          properties: {
            sectionType: { type: "string", enum: ["text", "itemList", "stringList"] },
            text: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  title: { type: "string" },
                  subtitle: { type: "string" },
                  years: { type: "string" },
                  description: { type: "array", items: { type: "string" } },
                },
                required: ["id", "title", "subtitle", "years", "description"],
                additionalProperties: false,
              },
            },
          },
          required: ["sectionType"],
          additionalProperties: false,
        },
      },
    },
    required: [
      "personalData",
      "summary",
      "educations",
      "workExperiences",
      "organizationExperiences",
      "personalProjects",
      "additional",
      "customSections",
    ],
    additionalProperties: false,
  },
};

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
      text: {
        format: {
          type: "json_schema",
          ...RESUME_JSON_SCHEMA,
        },
      },
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
