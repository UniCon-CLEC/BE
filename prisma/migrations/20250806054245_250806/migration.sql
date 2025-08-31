-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
