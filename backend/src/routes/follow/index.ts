import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { createFollowScheme, deleteFollowScheme } from "./scheme.js";

const prisma = new PrismaClient();

export const FollowRoute = new Hono<{ Variables: { userId: string } }>()
  .get("/", async (c) => {
    const result = await prisma.follow.findMany();
    if (!result) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(result);
  })
  .get("/following/:id", async (c) => {
    const id = c.req.param("id");
    const result = await prisma.follow.findMany({
      where: {
        following_id: id,
      },
      select: {
        followee_id: true,
        followee_user: {
          select: {
            display_name: true,
            icon_uri: true,
            description: true,
          },
        },
      },
    });
    if (!result) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(result);
  })
  .get("/followers/:id", async (c) => {
    const id = c.req.param("id");
    const result = await prisma.follow.findMany({
      where: {
        followee_id: id,
      },
      select: {
        following_id: true,
        following_user: {
          select: {
            display_name: true,
            icon_uri: true,
            description: true,
          },
        },
      }
    });
    if (!result) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(result);
  })
  .post(
    "/",
    zValidator("json", createFollowScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");
      const userId = c.get("userId");

      if (userId === body.followee_id) {
        return c.json({ message: "Cannot follow yourself" }, 400);
      }

      const isExist = await prisma.follow.findUnique({
        where: {
          following_id_followee_id: {
            following_id: userId,
            followee_id: body.followee_id,
          },
        },
      });

      if (isExist) {
        return c.json({ message: "Already following" }, 409);
      }

      const result = await prisma.follow.create({
        data: {
          following_id: userId,
          followee_id: body.followee_id,
        },
      });

      return c.json(result);
    },
  )
  .delete(
    "/:id",
    zValidator("json", deleteFollowScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const id = c.req.param("id");
      const userId = c.get("userId");

      const isExist = await prisma.follow.findUnique({
        where: {
          following_id_followee_id: {
            following_id: userId,
            followee_id: id,
          },
        },
      });

      if (!isExist) {
        return c.json({ message: "Not following" }, 409);
      }

      const result = await prisma.follow.delete({
        where: {
          following_id_followee_id: {
            following_id: userId,
            followee_id: id,
          },
        },
      });

      return c.json(result);
    },
  );
