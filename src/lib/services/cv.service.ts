import { CVRepository } from "../repositories/cv.repo";
import {
  FormDataDTO,
  CVListDTO,
  WorkExperienceSchema,
  OrganizationExperienceSchema,
  EducationSchema,
  PersonalDataSchema,
} from "../dto/cv.schema";
import { v4 as uuidv4 } from "uuid";
import { SectionType } from "@/generated/prisma";

export const CVService = {
  async createCV(userId: string, dto: FormDataDTO) {
    const id = uuidv4();

    const sections = [
      ...dto.educations.map((edu, i) => ({
        id: uuidv4(),
        type: SectionType.EDUCATION,
        content: edu,
      })),
      ...dto.workExperiences.map((work, i) => ({
        id: uuidv4(),
        type: SectionType.WORK,
        content: work,
      })),
      ...dto.organizationExperiences.map((org, i) => ({
        id: uuidv4(),
        type: SectionType.ORGANIZATION,
        content: org,
      })),
      {
        id: uuidv4(),
        type: SectionType.PERSONAL,
        content: {
          name: dto.name,
          phone: dto.phone,
          linkedin: dto.linkedin,
          email: dto.email,
          github: dto.github,
        },
      },
    ];
    // NOTE: Decide whether to return the created CV (with sections) or keep it fire-and-forget
    await CVRepository.createCV(id, userId, "Resume", sections);
  },

  async getAllCVByUserId(userId: string): Promise<CVListDTO[]> {
    const retrievedCVs = await CVRepository.findAllCVByUserId(userId);

    return retrievedCVs.map((cv) => ({
      id: cv.id,
      title: cv.title,
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt,
    }));
  },

  async getCVDetail(cvId: string, userId: string): Promise<FormDataDTO | null> {
    const retrievedCV = await CVRepository.findCVDetail(userId, cvId);

    if (!retrievedCV) {
      return null;
    }

    const educations = retrievedCV.sections
      .filter((s) => s.type === SectionType.EDUCATION)
      .map((s) => ({
        id: s.id,
        ...EducationSchema.parse(s.content),
      }));

    const workExperiences = retrievedCV.sections
      .filter((s) => s.type === SectionType.WORK)
      .map((s) => ({
        id: s.id,
        ...WorkExperienceSchema.parse(s.content),
      }));

    const organizationExperiences = retrievedCV.sections
      .filter((s) => s.type === SectionType.ORGANIZATION)
      .map((s) => ({
        id: s.id,
        ...OrganizationExperienceSchema.parse(s.content),
      }));

    // TODO: add id once FormData on types/form-data.ts is refactored to use `personalData`
    const personalSection = retrievedCV.sections.find(
      (s) => s.type === SectionType.PERSONAL
    );
    const personal = personalSection
      ? PersonalDataSchema.parse(personalSection.content)
      : undefined;

    const formData: FormDataDTO = {
      name: personal?.name || "",
      phone: personal?.phone || "",
      linkedin: personal?.linkedin || "",
      email: personal?.email || "",
      github: personal?.github || "",
      educations,
      workExperiences,
      organizationExperiences,
    };

    return formData;
  },

  async updateCV(cvId: string, userId: string, dto: FormDataDTO) {
    const sections = [
      ...dto.educations.map((edu, i) => ({
        id: edu.id ?? uuidv4(),
        type: SectionType.EDUCATION,
        content: edu,
      })),
      ...dto.workExperiences.map((work, i) => ({
        id: work.id ?? uuidv4(),
        type: SectionType.WORK,
        content: work,
      })),
      ...dto.organizationExperiences.map((org, i) => ({
        id: org.id ?? uuidv4(),
        type: SectionType.ORGANIZATION,
        content: org,
      })),
      {
        // TODO: replace id once FormData on types/form-data.ts is refactored to use `personalData`
        id: uuidv4(),
        type: SectionType.PERSONAL,
        content: {
          name: dto.name,
          phone: dto.phone,
          linkedin: dto.linkedin,
          email: dto.email,
          github: dto.github,
        },
      },
    ];

    // NOTE: Decide whether to return the updated CV (with sections) or keep it fire-and-forget
    await CVRepository.updateCV(cvId, userId, "resume", sections);
  },
};
