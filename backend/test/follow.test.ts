import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import { closeServer } from "../src/index.js";
import { spyOn } from "jest-mock";
import * as authMiddleware from "../src/middleware.js";
import { testClient } from "hono/testing";
import app from "../src/index.js";
import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const client = testClient(app);
const prisma = new PrismaClient();

// verifyJWTをモック化
describe("UserRoute API", () => {
    beforeAll(async () => {
        spyOn(authMiddleware, "verifyJWT").mockImplementation(
            async (token: string) => {
                if (token === "validtoken1") {
                    return "validFollowTestUser1";
                } else if (token === "validtoken2") {
                    return "validFollowTestUser2";
                } else if (token === "validtoken3") {
                    return "validFollowTestUser3";
                }
                return null;
            },
        );

        await prisma.user.create({
            data: {
                id: "validFollowTestUser1",
                display_name: "user1",
                icon_uri: "icon1",
                description: "description1",
            },
        });

        await prisma.user.create({
            data: {
                id: "validFollowTestUser2",
                display_name: "user2",
                icon_uri: "icon2",
                description: "description2",
            },
        });

        await prisma.user.create({
            data: {
                id: "validFollowTestUser3",
                display_name: "user3",
                icon_uri: "icon3",
                description: "description3",
            },
        });

        await prisma.follow.create({
            data: {
                following_id: "validFollowTestUser1",
                followee_id: "validFollowTestUser2",
            }
        })

        await prisma.follow.create({
            data: {
                following_id: "validFollowTestUser1",
                followee_id: "validFollowTestUser3",
            }
        })

    });

    afterAll(async () => {
        jest.restoreAllMocks();

        await prisma.follow.deleteMany({
            where: {
                OR: [
                    { following_id: "validFollowTestUser1" },
                    { followee_id: "validFollowTestUser1" },
                ],
            }
        })

        await prisma.user.deleteMany({
            where: {
                id: {
                    in: ["validFollowTestUser1", "validFollowTestUser2", "validFollowTestUser3"],
                },
            }
        })
        closeServer();
    });


    it("should return status 200 when token is valid", async () => {
        const res = await client.follow.following[":id"].$get(
            {
                param: { id: "validFollowTestUser1" },
            },
            {
                headers: {
                    Authorization: 'Bearer validtoken1'
                }
            }
        )
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([{
            followee_id: "validFollowTestUser2",
            followee_user: {
                display_name: "user2",
                icon_uri: "icon2",
                description: "description2",
            }
        }, {
            followee_id: "validFollowTestUser3",
            followee_user: {
                display_name: "user3",
                icon_uri: "icon3",
                description: "description3",
            }
        }
        ])
    })

    it("should return 401 when token is invalid", async () => {
        const res = await client.follow.following[":id"].$get(
            {
                param: { id: "validFollowTestUser1" },
            },
            {
                headers: {
                    Authorization: 'Bearer invalidtoken'
                }
            }
        )
        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ message: "Unauthorized" })
    })

    it("should return 404 when following user not found", async () => {
        const res = await client.follow.following[":id"].$get(
            {
                param: { id: "validFollowTestUser2" },
            },
            {
                headers: {
                    Authorization: 'Bearer validtoken1'
                }
            }
        )

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ message: "User not found" })
    })

    it("should return 200 when get followers by id", async () => {
        const res = await client.follow.followers[":id"].$get(
            {
                param: { id: "validFollowTestUser2" },
            },
            {
                headers: {
                    Authorization: "Bearer validtoken1",
                }
            }
        )
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual([{
            following_id: "validFollowTestUser1",
            following_user: {
                display_name: "user1",
                icon_uri: "icon1",
                description: "description1",
            }
        }])
    })

    it("should return 404 when followers user not found", async () => {
        const res = await client.follow.followers[":id"].$get(
            {
                param: { id: "validFollowTestUser1" },
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            })
        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ message: "User not found" })
    })

    it("should return 200 when follow user successfully", async () => {
        const res = await client.follow.$post(
            {
                json: {
                    followee_id: "validFollowTestUser1",
                }
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            }
        )
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            following_id: "validFollowTestUser2",
            followee_id: "validFollowTestUser1",
            created_at: expect.any(String),
            updated_at: expect.any(String),
        });

    })

    it("should return 409 when follow user already exists", async () => {
        const res = await client.follow.$post(
            {
                json: {
                    followee_id: "validFollowTestUser1",
                }
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            }
        )
        expect(res.status).toBe(409);
        expect(await res.json()).toEqual({ message: "Already following" });
    })

    it("should return 400 when follow yourself", async () => {
        const res = await client.follow.$post(
            {
                json: {
                    followee_id: "validFollowTestUser2",
                }
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            }
        )
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ message: "Cannot follow yourself" });
    })

    it("should return 500 when followee user not found", async () => {
        const res = await client.follow.$post(
            {
                json: {
                    followee_id: "invalidFollowTestUser",
                }
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            }
        )
        expect(res.status).toBe(500);
    })

    it("should return 200 when unfollow user successfully", async () => {
        const res = await client.follow[":id"].$delete(
            {
                param: { id: "validFollowTestUser1" },
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            }
        )
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            following_id: "validFollowTestUser2",
            followee_id: "validFollowTestUser1",
            created_at: expect.any(String),
            updated_at: expect.any(String),
        });
    })

    it("should return 409 when unfollow user not exists", async () => {
        const res = await client.follow[":id"].$delete(
            {
                param: { id: "validFollowTestUser1" },
            },
            {
                headers: {
                    Authorization: "Bearer validtoken2",
                }
            }
        )
        expect(res.status).toBe(409);
        expect(await res.json()).toEqual({ message: "Not following" });
    })

    it("should return 404 when unfollow user not found", async () => {
        const res = await client.follow[":id"].$delete(
            {
                param: { id: "Not exitst user" },
            },
            {
                headers: {
                    Authorization: "Bearer validtoken1",
                }
            }
        )
        expect(res.status).toBe(409);
        expect(await res.json()).toEqual({ message: "Not following" });
    })
});