/*
  Warnings:

  - You are about to drop the `RelationShip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RelationShip" DROP CONSTRAINT "RelationShip_followee_id_fkey";

-- DropForeignKey
ALTER TABLE "RelationShip" DROP CONSTRAINT "RelationShip_following_id_fkey";

-- DropTable
DROP TABLE "RelationShip";

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "followee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_following_id_followee_id_key" ON "Follow"("following_id", "followee_id");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followee_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
