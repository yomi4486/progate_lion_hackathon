/*
  Warnings:

  - You are about to drop the column `dispaly_name` on the `User` table. All the data in the column will be lost.
  - Added the required column `display_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dispaly_name",
ADD COLUMN     "display_name" VARCHAR(32) NOT NULL;
