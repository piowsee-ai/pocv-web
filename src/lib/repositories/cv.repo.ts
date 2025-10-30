import { prisma } from "../db/prisma-client";
import type { Cv, Section } from "@/generated/prisma";

export const CVRepository = {
  async findAllCVByUserId(userId: string): Promise<Cv[]> {
    return prisma.cv.findMany({
      where: {
        userId: userId,
      },
    });
  },

  async findCVDetail(
    userId: string,
    cvId: string
  ): Promise<(Cv & { sections: Section[] }) | null> {
    return prisma.cv.findFirst({
      where: {
        userId: userId,
        id: cvId,
      },
      include: {
        sections: true,
      },
    });
  },

  async createCV(
    cvId: string,
    userId: string,
    title: string,
    sections: any[]
  ): Promise<Cv & { sections: Section[] }> {
    return prisma.cv.create({
      data: {
        id: cvId,
        userId,
        title,
        sections: {
          create: sections,
        },
      },
      include: { sections: true },
    });
  },

  async updateCV(cvId: string, userId: string, title: string, sections: any[]) {
    return prisma.$transaction(async (tx) => {
      await tx.cv.update({
        where: { id: cvId, userId },
        data: { title },
      });

      await Promise.all(
        sections.map((s) =>
          tx.section.upsert({
            where: { id: s.id, cvId: cvId },
            update: {
              type: s.type,
              content: s.content,
            },
            create: {
              id: s.id,
              cvId: cvId,
              type: s.type,
              content: s.content,
            },
          })
        )
      );
      return tx.cv.findUnique({
        where: { id: cvId, userId },
        include: { sections: true },
      });
    });
  },
};
