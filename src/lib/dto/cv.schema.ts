import { z } from "zod";
import type {
  FormData,
  WorkExperience,
  OrganizationExperience,
  Education,
  PersonalData,
} from "@/types/form-data";

export const WorkExperienceSchema: z.ZodType<WorkExperience> = z.object({
  id: z.uuid().optional(),
  position: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  city: z.string(),
  description: z.string(),
});

export const OrganizationExperienceSchema: z.ZodType<OrganizationExperience> =
  z.object({
    id: z.uuid().optional(),
    position: z.string(),
    organization: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string(),
    description: z.string(),
  });

export const EducationSchema: z.ZodType<Education> = z.object({
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

export const PersonalDataSchema: z.ZodType<PersonalData> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  phone: z.string(),
  email: z.email(),
  linkedin: z.union([z.url(), z.literal("")]).optional(),
  github: z.union([z.url(), z.literal("")]).optional(),
});

export const FormDataSchema: z.ZodType<FormData> = z.object({
  personalData: PersonalDataSchema,
  educations: z.array(EducationSchema),
  workExperiences: z.array(WorkExperienceSchema),
  organizationExperiences: z.array(OrganizationExperienceSchema),
});