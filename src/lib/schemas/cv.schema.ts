import { z } from "zod";
import type {
  AdditionalInfo,
  CustomSection,
  CustomSectionItem,
  Education,
  FormData,
  OrganizationExperience,
  PersonalData,
  PersonalProject,
  WorkExperience,
} from "@/types/form-data";

export const WorkExperienceSchema: z.ZodType<WorkExperience> = z.object({
  id: z.string().optional(),
  position: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string()),
});

export const EducationSchema: z.ZodType<Education> = z.object({
  id: z.string().optional(),
  institution: z.string(),
  degree: z.string(),
  major: z.string(),
  location: z.string(),
  gpa: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string()),
});

export const OrganizationExperienceSchema: z.ZodType<OrganizationExperience> = z.object({
  id: z.string().optional(),
  position: z.string(),
  organization: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string()),
});

export const PersonalDataSchema: z.ZodType<PersonalData> = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.email(),
  location: z.string(),
  website: z.string(),
  linkedin: z.string(),
  github: z.string(),
});

export const PersonalProjectSchema: z.ZodType<PersonalProject> = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.array(z.string()),
});

export const AdditionalInfoSchema: z.ZodType<AdditionalInfo> = z.object({
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
});

export const CustomSectionItemSchema: z.ZodType<CustomSectionItem> = z.object({
  id: z.string().optional(),
  title: z.string(),
  subtitle: z.string(),
  years: z.string(),
  description: z.array(z.string()),
});

export const CustomSectionSchema: z.ZodType<CustomSection> = z.object({
  sectionKey: z.string(),
  sectionTitle: z.string(),
  sectionType: z.enum(["text", "itemList", "stringList"]),
  text: z.string(),
  items: z.array(CustomSectionItemSchema),
});

export const FormDataSchema: z.ZodType<FormData> = z.object({
  personalData: PersonalDataSchema,
  summary: z.string(),
  educations: z.array(EducationSchema),
  workExperiences: z.array(WorkExperienceSchema),
  organizationExperiences: z.array(OrganizationExperienceSchema),
  personalProjects: z.array(PersonalProjectSchema),
  additional: AdditionalInfoSchema,
  customSections: z.array(CustomSectionSchema),
});
