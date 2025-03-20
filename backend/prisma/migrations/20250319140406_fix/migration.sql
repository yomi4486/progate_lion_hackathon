/*
  Warnings:

  - You are about to drop the column `icon_url` on the `User` table. All the data in the column will be lost.
  - Added the required column `icon_uri` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "icon_url",
ADD COLUMN     "icon_uri" TEXT NOT NULL;
