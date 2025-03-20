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
    closeServer();
    await prisma.user.delete({
      where: {
        id: "validuser1",
      },
    });
  });

  it("should return status 200 when token is valid", async () => {
    // テスト用のリクエストを送信
    const res = await client.users.$get("/", {
      headers: {
        Authorization: "Bearer validtoken1",
      },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      expect.objectContaining({
        id: "validuser1",
        display_name: "user1",
        icon_uri: "icon1",
        description: "description1",
      }),
    ]);
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

  /*
  it("should return 409 when user already exists", async () => {
    const res = await client.users.$post({
      json: {
        display_name: "user1",
        icon_uri: "icon1",
        description: "description1",
      },
      headers: {
        Authorization: "Bearer validtoken1",
      },
    });
  
    expect(res.status).toBe(409);
  
    expect(await res.json()).toEqual({ message: "User already exists" });
  });
  */
});
