import { prisma } from "@/lib/db/prisma-client";
import type { Cv } from "@/generated/prisma";
import type { FormData } from "@/types/form-data";

export const CVRepository = {
  async findAllCVByUserId(userId: string): Promise<Cv[]> {
    return prisma.cv.findMany({
      where: {
        userId: userId,
      },
    });
  },

  async findCVDetail(userId: string, cvId: string): Promise<Cv | null> {
    return prisma.cv.findUnique({
      where: {
        userId: userId,
        id: cvId,
      },
    });
  },

  async createCV(
    cvId: string,
    userId: string,
    title: string,
    content: FormData
  ): Promise<Cv> {
    return prisma.cv.create({
      data: {
        id: cvId,
        userId,
        title,
        content: content as any,
      },
    });
  },

  async updateCV(
    cvId: string,
    userId: string,
    title: string,
    content: FormData
  ): Promise<Cv> {
    return prisma.cv.update({
      where: { id: cvId, userId },
      data: {
        title,
        content: content as any,
      },
    });
  },
};
