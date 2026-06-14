/** 
 * Service layer for CV operations
 * Handles logic between controllers and repositories
 */

import { CVRepository } from "../repositories/cv.repo";
import type { FormData } from "@/types/form-data";
import type { CVList } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

export const CVService = {
  async createCV(userId: string, data: FormData) {
    const id = uuidv4();
    const title = data.personalData.name
      ? `${data.personalData.name}'s CV`
      : "Untitled CV";
    const cv = await CVRepository.createCV(id, userId, title, data);
    return { id: cv.id };
  },

  async getAllCVByUserId(userId: string): Promise<CVList[]> {
    const retrievedCVs = await CVRepository.findAllCVByUserId(userId);

    return retrievedCVs.map((cv) => {
      const content = cv.content as unknown as FormData | null;
      const preview = content
        ? {
            name: content.personalData?.name || "",
            email: content.personalData?.email || "",
            phone: content.personalData?.phone || "",
            education:
              content.educations?.[0]?.institution ||
              content.educations?.[0]?.description?.[0] ||
              "",
            work:
              content.workExperiences?.[0]?.company
                ? `${content.workExperiences[0].position} at ${content.workExperiences[0].company}`
                : content.workExperiences?.[0]?.description?.[0] || "",
          }
        : undefined;

      return {
        id: cv.id,
        title: cv.title,
        createdAt: cv.createdAt,
        updatedAt: cv.updatedAt,
        preview,
      };
    });
  },

  async getCVDetail(cvId: string, userId: string): Promise<FormData | null> {
    const retrievedCV = await CVRepository.findCVDetail(userId, cvId);

    if (!retrievedCV) {
      return null;
    }

    // Content is stored as JSON, cast it back to FormData
    return retrievedCV.content as unknown as FormData;
  },

  async updateCV(cvId: string, userId: string, data: FormData) {
    await CVRepository.updateCV(cvId, userId, "Resume", data);
  },
};
