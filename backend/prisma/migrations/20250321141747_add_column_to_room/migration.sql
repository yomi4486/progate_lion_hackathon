/*
  Warnings:

  - Added the required column `room_description` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_thumbnail` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_title` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "room_description" VARCHAR(256) NOT NULL,
ADD COLUMN     "room_tags" TEXT[],
ADD COLUMN     "room_thumbnail" TEXT NOT NULL,
ADD COLUMN     "room_title" VARCHAR(64) NOT NULL;
