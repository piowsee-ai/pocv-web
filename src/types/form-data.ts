export interface FormData {
  name: string;
  phone: string;
  linkedin: string;
  email: string;
  github: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  organizationExperiences: OrganizationExperience[];
}
export interface WorkExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

export interface Education {
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
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}