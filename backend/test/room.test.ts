import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import { closeServer } from "../src/index.js";
import { spyOn } from "jest-mock";
import * as authMiddleware from "../src/middleware.js";
import { testClient } from "hono/testing";
import app from "../src/index.js";
import { PrismaClient } from "@prisma/client";


jest.mock("livekit-server-sdk", () => {
    return {
        AccessToken: jest.fn().mockImplementation(() => ({
            addGrant: jest.fn(),
            toJwt: jest.fn<() => Promise<string>>().mockResolvedValue("validAccessToken"), // 型を明示
        })),
        RoomServiceClient: jest.fn().mockImplementation(() => ({
            createRoom: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined),
            deleteRoom: jest.fn<() => Promise<undefined>>().mockResolvedValue(undefined),
        })),
    }
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
            }
        })
    });

    afterAll(async () => {
        jest.restoreAllMocks();

        await prisma.room.deleteMany({
            where: {
                room_owner_id: "validRoomTestUser1",
            }
        })

        await prisma.user.deleteMany(
            {
                where: {
                    id: {
                        in: ["validRoomTestUser1"],
                    },
                },
            },
        )
        closeServer();
    });

    it("should get room by id", async () => {
        const res = await client.room[":id"].$get(
            {
                param: { id: "room1" }
            },
            {
                headers: {
                    Authorization: "Bearer validtoken1"
                }
            }
        )
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            token: "validAccessToken",
            room_id: "room1",
            room_owner_id: "validRoomTestUser1",
        })
    })
});
