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
import { MAX_LENGTH } from "../validation/editor-validation";

export const WorkExperienceSchema: z.ZodType<WorkExperience> = z.object({
  id: z.string().optional(),
  position: z.string().max(MAX_LENGTH.POSITION),
  company: z.string().max(MAX_LENGTH.COMPANY),
  location: z.string().max(MAX_LENGTH.LOCATION),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string().max(MAX_LENGTH.DESCRIPTION)),
});

export const EducationSchema: z.ZodType<Education> = z.object({
  id: z.string().optional(),
  institution: z.string().max(MAX_LENGTH.INSTITUTION),
  degree: z.string().max(MAX_LENGTH.DEGREE),
  major: z.string().max(MAX_LENGTH.MAJOR),
  location: z.string().max(MAX_LENGTH.LOCATION),
  gpa: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string().max(MAX_LENGTH.DESCRIPTION)),
});

export const OrganizationExperienceSchema: z.ZodType<OrganizationExperience> =
  z.object({
    id: z.string().optional(),
    position: z.string().max(MAX_LENGTH.POSITION),
    organization: z.string().max(MAX_LENGTH.ORGANIZATION),
    startDate: z.string(),
    endDate: z.string(),
    description: z.array(z.string().max(MAX_LENGTH.DESCRIPTION)),
  });

export const PersonalDataSchema: z.ZodType<PersonalData> = z.object({
  name: z.string().max(MAX_LENGTH.NAME),
  phone: z.string().max(MAX_LENGTH.PHONE),
  email: z.email().max(MAX_LENGTH.EMAIL),
  location: z.string().max(MAX_LENGTH.LOCATION),
  website: z.string().max(MAX_LENGTH.URL),
  linkedin: z.string().max(MAX_LENGTH.URL),
  github: z.string().max(MAX_LENGTH.URL),
});

export const PersonalProjectSchema: z.ZodType<PersonalProject> = z.object({
  id: z.string().optional(),
  name: z.string().max(MAX_LENGTH.NAME),
  description: z.array(z.string().max(MAX_LENGTH.DESCRIPTION)),
});

export const AdditionalInfoSchema: z.ZodType<AdditionalInfo> = z.object({
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
});

export const CustomSectionItemSchema: z.ZodType<CustomSectionItem> = z.object({
  id: z.string().optional(),
  title: z.string().max(MAX_LENGTH.TITLE),
  subtitle: z.string().max(MAX_LENGTH.SUBTITLE),
  years: z.string(),
  description: z.array(z.string().max(MAX_LENGTH.DESCRIPTION)),
});

export const CustomSectionSchema: z.ZodType<CustomSection> = z.object({
  sectionKey: z.string(),
  sectionTitle: z.string().max(MAX_LENGTH.SECTION_TITLE),
  sectionType: z.enum(["text", "itemList", "stringList"]),
  text: z.string().max(MAX_LENGTH.DESCRIPTION),
  items: z.array(CustomSectionItemSchema),
});

export const FormDataSchema: z.ZodType<FormData> = z.object({
  personalData: PersonalDataSchema,
  summary: z.string().max(MAX_LENGTH.DESCRIPTION),
  educations: z.array(EducationSchema),
  workExperiences: z.array(WorkExperienceSchema),
  organizationExperiences: z.array(OrganizationExperienceSchema),
  personalProjects: z.array(PersonalProjectSchema),
  additional: AdditionalInfoSchema,
  customSections: z.array(CustomSectionSchema),
});
