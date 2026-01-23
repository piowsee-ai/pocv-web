// Export all form sections
export { PersonalDataSection } from "./personal/PersonalDataSection";
export { SummarySection } from "./summary/SummarySection";
export { EducationSection } from "./education/EducationSection";
export { WorkExperienceSection } from "./work/WorkExperienceSection";
export { OrganizationSection } from "./organization/OrganizationSection";
export { ProjectsSection } from "./project/ProjectsSection";
export { AdditionalSection } from "./custom/AdditionalSection";

// Export common types and helpers
export type { FormSectionProps } from "./common/types";
export { getDescriptionHtml, updateDescription } from "./common/helpers";

// Export step components mapping
import type { EditorStep } from "../editor-progress";
import { PersonalDataSection } from "./personal/PersonalDataSection";
import { SummarySection } from "./summary/SummarySection";
import { EducationSection } from "./education/EducationSection";
import { WorkExperienceSection } from "./work/WorkExperienceSection";
import { OrganizationSection } from "./organization/OrganizationSection";
import { ProjectsSection } from "./project/ProjectsSection";
import { AdditionalSection } from "./custom/AdditionalSection";
import { FormSectionProps } from "./common/types";

export const STEP_COMPONENTS: Record<EditorStep, React.FC<FormSectionProps>> = {
  personal: PersonalDataSection,
  summary: SummarySection,
  education: EducationSection,
  work: WorkExperienceSection,
  organization: OrganizationSection,
  projects: ProjectsSection,
  additional: AdditionalSection,
};
