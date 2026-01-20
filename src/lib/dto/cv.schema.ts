import { z } from "zod";
import type {
  WizardEducation,
  WizardOrganizationExperience,
  WizardFormData,
  WizardPersonalData,
  WizardWorkExperience,
} from "@/types/form-data";

export const WorkExperienceSchema: z.ZodType<WizardWorkExperience> = z.object({
  id: z.uuid().optional(),
  position: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  description: z.string(),
});

export const OrganizationExperienceSchema: z.ZodType<WizardOrganizationExperience> = z.object({
  id: z.uuid().optional(),
  position: z.string(),
  organization: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

export const EducationSchema: z.ZodType<WizardEducation> = z.object({
  id: z.uuid().optional(),
  degree: z.string(),
  major: z.string(),
  institution: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  gpa: z.string(),
  description: z.string(),
});

export const PersonalDataSchema: z.ZodType<WizardPersonalData> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  phone: z.string(),
  email: z.email(),
  linkedin: z.union([z.url(), z.string().startsWith("linkedin.com"), z.literal("")]),
  github: z.union([z.url(), z.string().startsWith("github.com"), z.literal("")]),
});

export const FormDataSchema: z.ZodType<WizardFormData> = z.object({
  personalData: PersonalDataSchema,
  educations: z.array(EducationSchema),
  workExperiences: z.array(WorkExperienceSchema),
  organizationExperiences: z.array(OrganizationExperienceSchema),
});