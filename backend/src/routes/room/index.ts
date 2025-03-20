import { Hono } from "hono";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { uuid } from "uuidv4";
import { config } from "dotenv";
import { zValidator } from "@hono/zod-validator";
import { createTokenScheme } from "./scheme.js";
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
  .post(
    "/token",
    zValidator("json", createTokenScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const userId = c.get("userId");
      const roomName = c.req.valid("json").roomName;
      const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
          identity: userId,
          ttl: "10m",
        },
      );
      at.addGrant({ roomJoin: true, room: roomName });
      return c.json({ token: at.toJwt() });
    },
  )
  .post("/", async (c) => {
    const userId = c.get("userId");
    const id = uuid();

    const result = await prisma.room.create({
      data: {
        room_id: id,
        room_owner_id: userId,
      },
    });

    if (!result) {
      return c.json({ message: "Failed to create room" }, 500);
    }

    try {
      const room = await roomService.createRoom({
        name: id,
        emptyTimeout: 10 * 60, // 10 minutes
        maxParticipants: 100,
      });
      return c.json(room);
    } catch (e) {
      console.error(e);
      return c.json({ message: "Failed to create room" }, 500);
    }
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

    try {
      await roomService.deleteRoom(roomId);
    } catch (e) {
      console.error(e);
      return c.json({ message: "Failed to delete room" }, 500);
    }
  });
