/*
  Warnings:

  - You are about to drop the column `trackId` on the `FundingTier` table. All the data in the column will be lost.
  - You are about to drop the column `fundingEndDate` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `fundingStartDate` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `fundingTargetAmount` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `postFundingPrice` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `fundingTierId` on the `TrackEnrollment` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Crew` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `fundingId` to the `FundingTier` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Track` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `trackTierId` to the `TrackEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FundingStatus" AS ENUM ('FUNDING', 'PREPARING', 'ACTIVE', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."CourseLifecycleStatus" AS ENUM ('PREPARING', 'ACTIVE', 'COMPLETED', 'CANCELED');

-- AlterEnum
ALTER TYPE "public"."CourseType" ADD VALUE 'FUNDING';

-- DropForeignKey
ALTER TABLE "public"."FundingTier" DROP CONSTRAINT "FundingTier_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrackEnrollment" DROP CONSTRAINT "TrackEnrollment_fundingTierId_fkey";

-- AlterTable
ALTER TABLE "public"."Crew" DROP COLUMN "status",
ADD COLUMN     "status" "public"."CourseLifecycleStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."FundingTier" DROP COLUMN "trackId",
ADD COLUMN     "fundingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Track" DROP COLUMN "fundingEndDate",
DROP COLUMN "fundingStartDate",
DROP COLUMN "fundingTargetAmount",
DROP COLUMN "postFundingPrice",
DROP COLUMN "status",
ADD COLUMN     "status" "public"."CourseLifecycleStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."TrackEnrollment" DROP COLUMN "fundingTierId",
ADD COLUMN     "trackTierId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."CrewStatus";

-- DropEnum
DROP TYPE "public"."EnrollmentType";

-- DropEnum
DROP TYPE "public"."TrackStatus";

-- CreateTable
CREATE TABLE "public"."Funding" (
    "id" SERIAL NOT NULL,
    "status" "public"."FundingStatus" NOT NULL,
    "fundingTargetAmount" DECIMAL(65,30) NOT NULL,
    "fundingStartDate" TIMESTAMP(3) NOT NULL,
    "fundingEndDate" TIMESTAMP(3) NOT NULL,
    "postFundingPrice" DECIMAL(65,30),
    "courseId" UUID NOT NULL,

    CONSTRAINT "Funding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FundingEnrollment" (
    "id" SERIAL NOT NULL,
    "amountPaid" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."EnrollmentStatus" NOT NULL,
    "userId" UUID NOT NULL,
    "fundingId" INTEGER NOT NULL,
    "fundingTierId" INTEGER NOT NULL,

    CONSTRAINT "FundingEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackTier" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "benefitDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "TrackTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Funding_courseId_key" ON "public"."Funding"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "FundingEnrollment_userId_fundingId_key" ON "public"."FundingEnrollment"("userId", "fundingId");

-- AddForeignKey
ALTER TABLE "public"."Funding" ADD CONSTRAINT "Funding_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundingEnrollment" ADD CONSTRAINT "FundingEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundingEnrollment" ADD CONSTRAINT "FundingEnrollment_fundingId_fkey" FOREIGN KEY ("fundingId") REFERENCES "public"."Funding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundingEnrollment" ADD CONSTRAINT "FundingEnrollment_fundingTierId_fkey" FOREIGN KEY ("fundingTierId") REFERENCES "public"."FundingTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackEnrollment" ADD CONSTRAINT "TrackEnrollment_trackTierId_fkey" FOREIGN KEY ("trackTierId") REFERENCES "public"."TrackTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundingTier" ADD CONSTRAINT "FundingTier_fundingId_fkey" FOREIGN KEY ("fundingId") REFERENCES "public"."Funding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackTier" ADD CONSTRAINT "TrackTier_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
