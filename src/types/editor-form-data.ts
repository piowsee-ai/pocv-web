/**
 * Editor-specific type extensions for FormData
 * These types extend the base FormData types with additional fields
 * used internally by the CV editor (isCurrent, descriptionHtml, etc.)
 * 
 * The base FormData types in form-data.ts should NOT be modified.
 */

import type {
  FormData as BaseFormData,
  PersonalData,
  Education as BaseEducation,
  WorkExperience as BaseWorkExperience,
  OrganizationExperience as BaseOrganizationExperience,
  PersonalProject as BasePersonalProject,
  AdditionalInfo,
  CustomSection as BaseCustomSection,
  CustomSectionItem as BaseCustomSectionItem,
} from "./form-data";

// Re-export unchanged types
export type { PersonalData, AdditionalInfo };

// Extended Education with editor-specific fields
export interface Education extends BaseEducation {
  maxGpa?: string;
  isCurrent?: boolean;
  descriptionHtml?: string;
}

// Extended WorkExperience with editor-specific fields
export interface WorkExperience extends BaseWorkExperience {
  isCurrent?: boolean;
  descriptionHtml?: string;
}

// Extended OrganizationExperience with editor-specific fields
export interface OrganizationExperience extends BaseOrganizationExperience {
  isCurrent?: boolean;
  descriptionHtml?: string;
}

// Extended PersonalProject with editor-specific fields
export interface PersonalProject extends BasePersonalProject {
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  descriptionHtml?: string;
}

// Extended CustomSectionItem with editor-specific fields
// Override 'years' to be optional since editor uses startDate/endDate separately
export interface CustomSectionItem extends Omit<BaseCustomSectionItem, "years"> {
  years?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  descriptionHtml?: string;
}

// Extended CustomSection using extended CustomSectionItem
export interface CustomSection extends Omit<BaseCustomSection, "items"> {
  items: CustomSectionItem[];
}

// Section titles for customizable headers
export interface SectionTitles {
  summary?: string;
  education?: string;
  workExperience?: string;
  organization?: string;
  projects?: string;
  additional?: string;
  [key: string]: string | undefined;
}

// Extended FormData for editor use
export interface EditorFormData extends Omit<BaseFormData, "educations" | "workExperiences" | "organizationExperiences" | "personalProjects" | "customSections"> {
  educations: Education[];
  workExperiences: WorkExperience[];
  organizationExperiences: OrganizationExperience[];
  personalProjects: PersonalProject[];
  customSections: CustomSection[];
  sectionTitles?: SectionTitles;
  sectionOrder?: string[];
}

// Alias for backward compatibility
export type FormData = EditorFormData;
