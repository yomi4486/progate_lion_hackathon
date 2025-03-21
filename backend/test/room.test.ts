import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import { closeServer } from "../src/index.js";
import { spyOn } from "jest-mock";
import * as authMiddleware from "../src/middleware.js";
import { testClient } from "hono/testing";
import app from "../src/index.js";
import { PrismaClient } from "@prisma/client";
import { Room } from "livekit-server-sdk";
import { create } from "domain";

jest.mock("livekit-server-sdk", () => {
  return {
    AccessToken: jest.fn().mockImplementation(() => ({
      addGrant: jest.fn(),
      toJwt: jest
        .fn<() => Promise<string>>()
        .mockResolvedValue("validAccessToken"), // 型を明示
    })),
    RoomServiceClient: jest.fn().mockImplementation(() => ({
      createRoom: jest
        .fn<() => Promise<undefined>>()
        .mockResolvedValue(undefined),
      deleteRoom: jest
        .fn<() => Promise<undefined>>()
        .mockResolvedValue(undefined),
    })),
  };
});

const client = testClient(app);
const prisma = new PrismaClient();

// verifyJWTをモック化
describe("UserRoute API", () => {
  beforeAll(async () => {
    spyOn(authMiddleware, "verifyJWT").mockImplementation(
      async (token: string) => {
        if (token === "validtoken1") {
          return "validRoomTestUser1";
        } else if (token === "validtoken2") {
          return "validRoomTestUser2";
        }
        return null;
      },
    );

    await prisma.user.create({
      data: {
        id: "validRoomTestUser1",
        display_name: "user1",
        icon_uri: "icon1",
        description: "description1",
      },
    });

    await prisma.room.create({
      data: {
        room_id: "room1",
        room_owner_id: "validRoomTestUser1",
        room_title: "title1",
        room_description: "description1",
        room_thumbnail: "thumbnail1",
        room_tags: ["tag1", "tag2"],
      },
    });

    await prisma.room.create({
      data: {
        room_id: "room2",
        room_owner_id: "validRoomTestUser1",
        room_title: "title2",
        room_description: "description2",
        room_thumbnail: "thumbnail2",
        room_tags: ["tag1", "tag2"],
      },
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await prisma.room.deleteMany({
      where: {
        room_owner_id: "validRoomTestUser1",
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: ["validRoomTestUser1"],
        },
      },
    });
    closeServer();
  });

  it("GET /room should return all rooms", async () => {
    const res = await client.room.$get(
      {},
      {
        headers: { Authorization: "Bearer validtoken1" },
      },
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      {
        room_id: "room1",
        room_owner_id: "validRoomTestUser1",
        room_title: "title1",
        room_description: "description1",
        room_thumbnail: "thumbnail1",
        room_tags: ["tag1", "tag2"],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      {
        room_id: "room2",
        room_owner_id: "validRoomTestUser1",
        room_title: "title2",
        room_description: "description2",
        room_thumbnail: "thumbnail2",
        room_tags: ["tag1", "tag2"],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    ]);
  });

  it("should get room by id", async () => {
    const res = await client.room[":id"].$get(
      {
        param: { id: "room1" },
      },
      {
        headers: {
          Authorization: "Bearer validtoken1",
        },
      },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      token: "validAccessToken",
      room_id: "room1",
      room_owner_id: "validRoomTestUser1",
    });
  });

  it("should return status 404 when room is not found", async () => {
    const res = await client.room[":id"].$get(
      {
        param: { id: "room4" },
      },
      {
        headers: { Authorization: "Bearer validtoken1" },
      },
    );

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: "Room not found" });
  });

  it("should return 200 when room is created", async () => {
    const res = await client.room.$post(
      {
        json: {
          room_title: "title3",
          room_description: "description3",
          room_thumbnail: "thumbnail3",
          room_tags: ["tag1", "tag2"],
        },
      },
      {
        headers: { Authorization: "Bearer validtoken1" },
      },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Room created",
      room_id: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      ), // UUID形式
    });
  });

  it("should not delete room if user is not owner", async () => {
    const res = await client.room[":id"].$delete(
      {
        param: { id: "room1" },
      },
      {
        headers: { Authorization: "Bearer validtoken2" },
      },
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: "Room not found" });
  });

  it("should not delete room if room does not exist", async () => {
    const res = await client.room[":id"].$delete(
      {
        param: { id: "room3" },
      },
      {
        headers: { Authorization: "Bearer validtoken1" },
      },
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: "Room not found" });
  });

  it("should delete room if user is owner and room exists", async () => {
    const res = await client.room[":id"].$delete(
      {
        param: { id: "room2" },
      },
      {
        headers: { Authorization: "Bearer validtoken1" },
      },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Room deleted" });
  });
});
