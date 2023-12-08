/*
  Warnings:

  - Added the required column `vid` to the `YouTubeLink` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `YouTubeLink` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrl` on table `YouTubeLink` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `YouTubeLink` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "YouTubeLink" ADD COLUMN     "vid" TEXT NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "thumbnailUrl" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL;
