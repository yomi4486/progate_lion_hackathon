import { it, expect, describe, beforeAll, afterAll, jest } from '@jest/globals';
import { closeServer } from '../src/index.js';
import { spyOn } from 'jest-mock';
import * as authMiddleware from '../src/middleware.js';
import { testClient } from 'hono/testing';
import app from '../src/index.js';

const client = testClient(app);
let server;

// verifyJWTをモック化
describe("UserRoute API", () => {
  beforeAll(() => {
    spyOn(authMiddleware, 'verifyJWT').mockImplementation(async (token: string) => {
      if (token === "validtoken1") {
        return "validuser1";
      } else if (token === "validtoken2") {
        return "validuser2";
      }
      return null;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
    closeServer();
  })

  it("should return status 200 when token is valid", async () => {
    // テスト用のリクエストを送信
    const res = await client.users.$get("/", {
      headers: {
        Authorization: "Bearer validtoken1",
      },
    });

    expect(res.status).toBe(200);
  });
});