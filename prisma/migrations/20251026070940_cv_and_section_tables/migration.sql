-- CreateEnum
CREATE TYPE "public"."SectionType" AS ENUM ('EDUCATION', 'EXPERIENCE', 'SKILLS', 'PERSONAL');

-- CreateTable
CREATE TABLE "public"."cv" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."section" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "type" "public"."SectionType" NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."cv" ADD CONSTRAINT "cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."section" ADD CONSTRAINT "section_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "public"."cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
