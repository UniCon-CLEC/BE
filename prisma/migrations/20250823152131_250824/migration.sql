/*
  Warnings:

  - You are about to drop the column `fundingEndDate` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `fundingStartDate` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `fundingTargetAmount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `postFundingPrice` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `FundingTier` table. All the data in the column will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `FundingTier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CourseType" AS ENUM ('TRACK', 'CREW');

-- CreateEnum
CREATE TYPE "public"."TrackStatus" AS ENUM ('FUNDING', 'PREPARING', 'ACTIVE', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."CrewStatus" AS ENUM ('PREPARING', 'ACTIVE', 'COMPLETED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_fundingTierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FundingTier" DROP CONSTRAINT "FundingTier_courseId_fkey";

-- AlterTable
ALTER TABLE "public"."Course" DROP COLUMN "fundingEndDate",
DROP COLUMN "fundingStartDate",
DROP COLUMN "fundingTargetAmount",
DROP COLUMN "postFundingPrice",
DROP COLUMN "status",
ADD COLUMN     "type" "public"."CourseType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."FundingTier" DROP COLUMN "courseId",
ADD COLUMN     "trackId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Instructor" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Enrollment";

-- DropEnum
DROP TYPE "public"."CourseStatus";

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" SERIAL NOT NULL,
    "status" "public"."TrackStatus" NOT NULL,
    "fundingTargetAmount" DECIMAL(65,30) NOT NULL,
    "fundingStartDate" TIMESTAMP(3) NOT NULL,
    "fundingEndDate" TIMESTAMP(3) NOT NULL,
    "postFundingPrice" DECIMAL(65,30),
    "courseId" UUID NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Crew" (
    "id" SERIAL NOT NULL,
    "status" "public"."CrewStatus" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "courseId" UUID NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackEnrollment" (
    "id" SERIAL NOT NULL,
    "amountPaid" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."EnrollmentStatus" NOT NULL,
    "userId" UUID NOT NULL,
    "trackId" INTEGER NOT NULL,
    "fundingTierId" INTEGER NOT NULL,

    CONSTRAINT "TrackEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrewEnrollment" (
    "id" SERIAL NOT NULL,
    "amountPaid" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."EnrollmentStatus" NOT NULL,
    "userId" UUID NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "CrewEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_courseId_key" ON "public"."Track"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Crew_courseId_key" ON "public"."Crew"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackEnrollment_userId_trackId_key" ON "public"."TrackEnrollment"("userId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewEnrollment_userId_crewId_key" ON "public"."CrewEnrollment"("userId", "crewId");

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Crew" ADD CONSTRAINT "Crew_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEnrollment" ADD CONSTRAINT "TrackEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEnrollment" ADD CONSTRAINT "TrackEnrollment_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEnrollment" ADD CONSTRAINT "TrackEnrollment_fundingTierId_fkey" FOREIGN KEY ("fundingTierId") REFERENCES "public"."FundingTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrewEnrollment" ADD CONSTRAINT "CrewEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrewEnrollment" ADD CONSTRAINT "CrewEnrollment_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "public"."Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundingTier" ADD CONSTRAINT "FundingTier_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
