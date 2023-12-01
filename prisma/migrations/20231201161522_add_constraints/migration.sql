/*
  Warnings:

  - You are about to alter the column `title` on the `YouTubeLink` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `YouTubeLink` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "YouTubeLink" ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(300);
