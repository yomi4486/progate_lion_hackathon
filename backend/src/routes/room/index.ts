import { Hono } from "hono";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();

const livekitHost = "https://progatehackathon-0vilmkur.livekit.cloud";
const roomService = new RoomServiceClient(
  livekitHost,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET,
);
const prisma = new PrismaClient();

export const RoomRoute = new Hono<{ Variables: { userId: string } }>()
  .get("/:id", async (c) => {
    const roomId = c.req.param("id");
    const userId = c.get("userId");

    const result = await prisma.room.findUnique({
      where: {
        room_id: roomId,
      },
    });

    if (!result) {
      return c.json({ message: "Room not found" }, 404);
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY as string,
      process.env.LIVEKIT_API_SECRET as string,
      {
        identity: userId,
        ttl: "10m",
      },
    );

    at.addGrant({ roomJoin: true, room: roomId });

    return c.json({
      token: await at.toJwt(),
      room_id: roomId,
      room_owner_id: result.room_owner_id,
    });
  })
  .post("/", async (c) => {
    const userId = c.get("userId");
    const id = uuidv4();

    const result = await prisma.room.create({
      data: {
        room_id: id,
        room_owner_id: userId,
      },
    });

    if (!result) {
      return c.json({ message: "Failed to create room" }, 500);
    }

    await roomService.createRoom({
      name: id,
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 100,
    });
    return c.json({ message: "Room created", room_id: id});
  })
  .delete("/:id", async (c) => {
    const roomId = c.req.param("id");
    const userId = c.get("userId");

    const result = await prisma.room.findUnique({
      where: {
        room_id: roomId,
        room_owner_id: userId,
      },
    });

    if (!result) {
      return c.json({ message: "Room not found" }, 404);
    }

    await prisma.room.delete({
      where: {
        room_id: roomId,
        room_owner_id: userId,
      },
    });

    await roomService.deleteRoom(roomId);
    return c.json({ message: "Room deleted" });
  });
