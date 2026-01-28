import OpenAI from "openai";
import {
  LLMProviderClient,
  LLMMessage,
  LLMResponse,
  LLMConfig,
  DEFAULT_CONFIGS,
  ResponseSchemaType,
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
          additionalProperties: false,
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
          additionalProperties: false,
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
          additionalProperties: false,
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
        type: "array",
        items: {
          type: "object",
          properties: {
            sectionKey: { type: "string" },
            sectionTitle: { type: "string" },
            sectionType: { type: "string", enum: ["text", "itemList", "stringList"] },
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
                additionalProperties: false,
              },
            },
          },
          required: ["sectionKey", "sectionTitle", "sectionType", "text", "items"],
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

const KEYWORDS_JSON_SCHEMA = {
  name: "keywords",
  strict: true,
  schema: {
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
    additionalProperties: false,
  },
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
    const schemaConfig = getSchemaConfig(config?.responseSchema);

    // Build input string from messages
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");
    
    // Combine messages into input
    const input = userMessages.map((m) => m.content).join("\n\n");

    // Build text format options based on schema
    const textFormat = schemaConfig
      ? {
          format: {
            type: "json_schema" as const,
            ...schemaConfig,
          },
        }
      : { format: { type: "json_object" as const } };

    const response = await this.client.responses.create({
      model,
      instructions: systemMessage?.content,
      input,
      text: textFormat,
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
