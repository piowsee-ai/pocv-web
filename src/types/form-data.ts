export interface WorkExperience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

export interface FormData {
  name: string;
  phone: string;
  linkedin: string;
  email: string;
  github: string;
  education: string;
  workExperiences: WorkExperience[];
  organization: string;
  softSkills: string;
  hardSkills: string;
  achievements: string;
}