-- AlterTable
ALTER TABLE "public"."Outfit" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "occasion" TEXT,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
