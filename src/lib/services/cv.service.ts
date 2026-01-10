/** 
 * Service layer for CV operations
 * Handles logic between controllers and repositories
 */

import { CVRepository } from "../repositories/cv.repo";
import {
  WorkExperienceSchema,
  OrganizationExperienceSchema,
  EducationSchema,
  PersonalDataSchema,
} from "../dto/cv.schema";
import type { Education, FormData, OrganizationExperience, PersonalData, WorkExperience } from "@/types/form-data";
import type { CVList } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";
import { SectionType } from "@/generated/prisma";

// Remove client-generated `id` to prevent saving client identifiers
function eraseId(obj: any) {
  if (obj && typeof obj === "object") {
    const { id, ...rest } = obj;
    return rest;
  }

  // If the input is not an object, return it unchanged to avoid returning undefined
  return obj;
}

export const CVService = {
  async createCV(userId: string, data: FormData) {
    const id = uuidv4();

    const sections = [
      ...data.educations.map((edu) => ({
        id: uuidv4(),
        type: SectionType.EDUCATION,
        content: eraseId({ ...edu }),
      })),
      ...data.workExperiences.map((work) => ({
        id: uuidv4(),
        type: SectionType.WORK,
        content: eraseId({ ...work }),
      })),
      ...data.organizationExperiences.map((org) => ({
        id: uuidv4(),
        type: SectionType.ORGANIZATION,
        content: eraseId({ ...org }),
      })),
      {
        id: uuidv4(),
        type: SectionType.PERSONAL,
        content: eraseId({ ...data.personalData }),
      },
    ];
    // NOTE: Decide whether to return the created CV (with sections) or keep it fire-and-forget
    await CVRepository.createCV(id, userId, "Resume", sections);
  },

  async getAllCVByUserId(userId: string): Promise<CVList[]> {
    const retrievedCVs = await CVRepository.findAllCVByUserId(userId);

    return retrievedCVs.map((cv) => ({
      id: cv.id,
      title: cv.title,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    }));
  },

  async getCVDetail(cvId: string, userId: string): Promise<FormData | null> {
    const retrievedCV = await CVRepository.findCVDetail(userId, cvId);

    if (!retrievedCV) {
      return null;
    }

    const educations: Education[] = retrievedCV.sections
      .filter((s) => s.type === SectionType.EDUCATION)
      .map((s) => ({
        id: s.id,
        ...EducationSchema.parse(s.content),
      }));

    const workExperiences: WorkExperience[] = retrievedCV.sections
      .filter((s) => s.type === SectionType.WORK)
      .map((s) => ({
        id: s.id,
        ...WorkExperienceSchema.parse(s.content),
      }));

    const organizationExperiences: OrganizationExperience[] = retrievedCV.sections
      .filter((s) => s.type === SectionType.ORGANIZATION)
      .map((s) => ({
        id: s.id,
        ...OrganizationExperienceSchema.parse(s.content),
      }));

    const personal = retrievedCV.sections.find(
      (s) => s.type === SectionType.PERSONAL
    );

    if (!personal) {
      throw new Error("PERSONAL section not found");
    }

    const personalData: PersonalData = { 
      id: personal.id, 
      ...PersonalDataSchema.parse(personal.content),
    };

    const formData: FormData = {
      personalData,
      educations,
      workExperiences,
      organizationExperiences,
    };

    return formData;
  },

  async updateCV(cvId: string, userId: string, data: FormData) {
    const sections = [
      ...data.educations.map((edu) => {
        const { id, ...eduContent } = edu;
        return {
          id: id ?? uuidv4(),
          type: SectionType.EDUCATION,
          content: eduContent,
        };
      }),
      ...data.workExperiences.map((work) => {
        const { id, ...workContent } = work;
        return {
          id: id ?? uuidv4(),
          type: SectionType.WORK,
          content: workContent,
        };
      }),
      ...data.organizationExperiences.map((org) => {
        const { id, ...orgContent } = org;
        return {
          id: id ?? uuidv4(),
          type: SectionType.ORGANIZATION,
          content: orgContent,
        };
      }),
      (() => {
        const { id, ...personalContent } = data.personalData;
        return {
          id: id ?? uuidv4(),
          type: SectionType.PERSONAL,
          content: personalContent
        };
      })()
    ];

    // NOTE: Decide whether to return the updated CV (with sections) or keep it fire-and-forget
    await CVRepository.updateCV(cvId, userId, "resume", sections);
    
    return;
  },
};
