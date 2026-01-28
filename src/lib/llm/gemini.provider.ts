import { GoogleGenAI } from "@google/genai";
import {
  LLMProviderClient,
  LLMMessage,
  LLMResponse,
  LLMConfig,
  DEFAULT_CONFIGS,
  ResponseSchemaType,
} from "./types";

// Resume JSON Schema for Gemini
const RESUME_JSON_SCHEMA = {
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
    },
    summary: { type: "string" },
    educations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          major: { type: "string" },
          location: { type: "string" },
          gpa: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: { type: "array", items: { type: "string" } },
        },
        required: ["institution", "degree", "major", "location", "gpa", "startDate", "endDate", "description"],
      },
    },
    workExperiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          position: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: { type: "array", items: { type: "string" } },
        },
        required: ["position", "company", "location", "startDate", "endDate", "description"],
      },
    },
    organizationExperiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          position: { type: "string" },
          organization: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          description: { type: "array", items: { type: "string" } },
        },
        required: ["position", "organization", "startDate", "endDate", "description"],
      },
    },
    personalProjects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "array", items: { type: "string" } },
        },
        required: ["name", "description"],
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
    },
    customSections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sectionKey: { type: "string" },
          sectionTitle: { type: "string" },
          sectionType: { type: "string" },
          text: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                subtitle: { type: "string" },
                years: { type: "string" },
                description: { type: "array", items: { type: "string" } },
              },
              required: ["title", "subtitle", "years", "description"],
            },
          },
        },
        required: ["sectionKey", "sectionTitle", "sectionType", "text", "items"],
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
};

// Keywords JSON Schema for Gemini
const KEYWORDS_JSON_SCHEMA = {
  type: "object",
  properties: {
    required_skills: { type: "array", items: { type: "string" } },
    preferred_skills: { type: "array", items: { type: "string" } },
    experience_requirements: { type: "array", items: { type: "string" } },
    education_requirements: { type: "array", items: { type: "string" } },
    key_responsibilities: { type: "array", items: { type: "string" } },
    keywords: { type: "array", items: { type: "string" } },
    experience_years: { type: "number" },
    seniority_level: { type: "string" },
  },
  required: [
    "required_skills",
    "preferred_skills",
    "experience_requirements",
    "education_requirements",
    "key_responsibilities",
    "keywords",
    "experience_years",
    "seniority_level",
  ],
};

// Map schema type to schema object
function getSchemaConfig(schemaType?: ResponseSchemaType) {
  switch (schemaType) {
    case "keywords":
      return KEYWORDS_JSON_SCHEMA;
    case "none":
      return null;
    case "resume":
    default:
      return RESUME_JSON_SCHEMA;
  }
}

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
    const schemaConfig = getSchemaConfig(config?.responseSchema);

    // Extract system instruction and user messages
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    // Build contents with system instruction included as first user message
    let fullContents = "";
    if (systemMessage?.content) {
      fullContents = `Instructions: ${systemMessage.content}\n\n`;
    }
    fullContents += userMessages.map((m) => m.content).join("\n\n");

    // Build config with optional JSON schema
    const generateConfig: Record<string, unknown> = {
      temperature,
      maxOutputTokens: maxTokens,
    };

    // Add JSON schema if specified
    if (schemaConfig) {
      generateConfig.responseMimeType = "application/json";
      generateConfig.responseJsonSchema = schemaConfig;
    }

    const response = await this.client.models.generateContent({
      model,
      contents: fullContents,
      config: generateConfig,
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

