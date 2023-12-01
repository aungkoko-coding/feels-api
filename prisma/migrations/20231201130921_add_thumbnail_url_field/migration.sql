/*
  Warnings:

  - Added the required column `thumbnailUrl` to the `YouTubeLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YouTubeLink" ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;
