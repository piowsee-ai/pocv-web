export interface FormData {
  name: string;
  phone: string;
  linkedin?: string;
  email: string;
  github?: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  organizationExperiences: OrganizationExperience[];
}
export interface WorkExperience {
  id?: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

export interface Education {
  id?: string;
  degree: string;
  major: string;
  institution: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  description: string;
}

export interface OrganizationExperience {
  id?: string;
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface PersonalData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
}
