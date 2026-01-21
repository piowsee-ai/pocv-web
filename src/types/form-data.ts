export interface FormData {
  personalData: PersonalData;
  summary: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  organizationExperiences: OrganizationExperience[];
  personalProjects: PersonalProject[];
  additional: AdditionalInfo;
  customSections: CustomSection[];
}

export interface WorkExperience {
  id?: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  major: string;
  location: string;
  gpa: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface OrganizationExperience {
  id?: string;
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface PersonalData {
  name: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface PersonalProject {
  id?: string;
  name: string;
  description: string[];
}

export interface AdditionalInfo {
  skills: string[];
  languages: string[];
  certifications: string[];
  achievements: string[];
}

export interface CustomSection {
  sectionKey: string;
  sectionTitle: string;
  sectionType: "text" | "itemList" | "stringList";
  text: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id?: string;
  title: string;
  subtitle: string;
  years: string;
  description: string[];
}

// Wizard-specific types (used during initial form input)
export interface WizardPersonalData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

export interface WizardEducation {
  degree: string;
  major: string;
  institution: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  description: string;
}

export interface WizardWorkExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface WizardOrganizationExperience {
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface WizardFormData {
  personalData: WizardPersonalData;
  educations: WizardEducation[];
  workExperiences: WizardWorkExperience[];
  organizationExperiences: WizardOrganizationExperience[];
}
