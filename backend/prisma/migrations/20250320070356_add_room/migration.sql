-- CreateTable
CREATE TABLE "Room" (
    "room_id" TEXT NOT NULL,
    "room_owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_room_owner_id_fkey" FOREIGN KEY ("room_owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
