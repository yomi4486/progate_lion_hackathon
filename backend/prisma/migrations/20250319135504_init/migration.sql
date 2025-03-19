-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "dispaly_name" VARCHAR(32) NOT NULL,
    "icon_url" TEXT NOT NULL,
    "description" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationShip" (
    "id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "followee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelationShip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelationShip_following_id_followee_id_key" ON "RelationShip"("following_id", "followee_id");

-- AddForeignKey
ALTER TABLE "RelationShip" ADD CONSTRAINT "RelationShip_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationShip" ADD CONSTRAINT "RelationShip_followee_id_fkey" FOREIGN KEY ("followee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
