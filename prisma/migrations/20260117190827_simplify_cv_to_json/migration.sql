/*
  Warnings:

  - You are about to drop the `section` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `cv` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "section" DROP CONSTRAINT "section_cvId_fkey";

-- AlterTable
ALTER TABLE "cv" ADD COLUMN     "content" JSONB NOT NULL;

-- DropTable
DROP TABLE "section";

-- DropEnum
DROP TYPE "SectionType";
