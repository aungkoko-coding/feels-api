-- AlterTable
ALTER TABLE "YouTubeLink" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "thumbnailUrl" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "vid" DROP NOT NULL;