-- CreateEnum
CREATE TYPE "public"."SurveyType" AS ENUM ('TRACK_TOPIC', 'CREW_TOPIC');

-- CreateTable
CREATE TABLE "public"."Survey" (
    "id" UUID NOT NULL,
    "type" "public"."SurveyType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "recommendUsers" TEXT[],

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SurveyTags" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SurveyTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SurveyTags_B_index" ON "public"."_SurveyTags"("B");

-- AddForeignKey
ALTER TABLE "public"."Survey" ADD CONSTRAINT "Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SurveyTags" ADD CONSTRAINT "_SurveyTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SurveyTags" ADD CONSTRAINT "_SurveyTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
