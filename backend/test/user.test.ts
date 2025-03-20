import { it, expect, describe, beforeAll, jest } from '@jest/globals';
import * as authMiddleware from '../src/middleware.js';
import type { Context } from "hono";
import { testClient } from "hono/testing";
import app from '../src/index.js';

const client = testClient(app);

// verifyJWTをモック化
describe("UserRoute API", () => {
  beforeAll(() => {
    jest.spyOn(authMiddleware, 'verifyJWT').mockImplementation(async (c: Context) => {
      const authHeader = c.req.header("Authorization");
      if (authHeader === "Bearer validtoken1") {
        return "validuser1";
      } else if (authHeader === "Bearer validtoken2") {
        return "validuser2";
      }
      return null;
    });
  });

  it("should return validuser1 for validtoken1", async () => {
    const res = await client.users.$get({
        headers: {
            Authorization: "Bearer validtoken1"
        }
    })
    expect(res.status).toBe(200);
  });
});