import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import { closeServer } from "../src/index.js";
import { spyOn } from "jest-mock";
import * as authMiddleware from "../src/middleware.js";
import { testClient } from "hono/testing";
import app from "../src/index.js";
import { PrismaClient } from "@prisma/client";

const client = testClient(app);
const prisma = new PrismaClient();

// verifyJWTをモック化
describe("UserRoute API", () => {
  beforeAll(async () => {
    spyOn(authMiddleware, "verifyJWT").mockImplementation(
      async (token: string) => {
        if (token === "validtoken1") {
          return "validuser1";
        } else if (token === "validtoken2") {
          return "validuser2";
        }
        return null;
      },
    );

    await prisma.user.create({
      data: {
        id: "validuser1",
        display_name: "user1",
        icon_uri: "icon1",
        description: "description1",
      },
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    await prisma.follow.deleteMany({
      where: {
        OR: [{ following_id: "validuser1" }, { followee_id: "validuser1" }],
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: ["validuser1", "validuser2"],
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: ["validuser1", "validuser2"],
        },
      },
    });
    closeServer();
  });

  it("should return status 200 when token is valid", async () => {
    // テスト用のリクエストを送信
    const res = await client.users.$get("/", {
      headers: {
        Authorization: "Bearer validtoken1",
      },
    });

    expect(res.status).toBe(200);
  });

  it("should return status 401 when token is invalid", async () => {
    const res = await client.users.$get("/", {
      headers: {
        Authorization: "Bearer invalidtoken",
      },
    });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: "Unauthorized" });
  });

  it("should return 409 when user already exists", async () => {
    const res = await client.users.$post(
      {
        json: {
          display_name: "user1",
          icon_uri: "icon1",
          description: "description1",
        },
      },
      {
        headers: {
          Authorization: "Bearer validtoken1",
        },
      },
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ message: "User already exists" });
  });

  it("should return 200 when user is created", async () => {
    const res = await client.users.$post(
      {
        json: {
          display_name: "user2",
          icon_uri: "icon2",
          description: "description2",
        },
      },
      {
        headers: {
          Authorization: "Bearer validtoken2",
        },
      },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        id: "validuser2",
        display_name: "user2",
        icon_uri: "icon2",
        description: "description2",
      }),
    );
  });

  it("should return 200 when get user by id", async () => {
    const res = await client.users[":id"].$get(
      {
        param: {
          id: "validuser1",
        },
      },
      {
        headers: {
          Authorization: "Bearer validtoken1",
        },
      },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        id: "validuser1",
        display_name: "user1",
        icon_uri: "icon1",
        description: "description1",
      }),
    );
  });

  it("should return 200 when user is updated", async () => {
    const res = await client.users.$put(
      {
        json: {
          display_name: "updated_user1",
        },
      },
      {
        headers: {
          Authorization: "Bearer validtoken1",
        },
      },
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        id: "validuser1",
        display_name: "updated_user1",
        icon_uri: "icon1",
        description: "description1",
        updated_at: expect.any(String),
      }),
    );
  });
  it("should return 200 when user is deleted", async () => {
    const res = await client.users.$delete("/", {
      headers: {
        Authorization: "Bearer validtoken2",
      },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        id: "validuser2",
        display_name: "user2",
        icon_uri: "icon2",
        description: "description2",
        updated_at: expect.any(String),
      }),
    );
  });

  it("should return 404 when user is not found", async () => {
    const res = await client.users[":id"].$get(
      {
        param: {
          id: "invaliduser",
        },
      },
      {
        headers: {
          Authorization: "Bearer validtoken1",
        },
      },
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ message: "User not found" });
  });
});
