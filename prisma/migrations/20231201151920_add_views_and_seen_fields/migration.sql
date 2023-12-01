-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "YouTubeLink" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
