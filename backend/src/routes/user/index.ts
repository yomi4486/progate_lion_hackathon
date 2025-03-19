import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { zValidator } from "@hono/zod-validator";
import { createUserScheme, updateUserScheme } from "./scheme.js";

const prisma = new PrismaClient();

export const UserRoute = new Hono<{ Variables: { userId: string } }>()
  .get("/", async (c) => {
    const result = await prisma.user.findMany();
    if (!result) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(result);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      }
    });
    if (!result) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(result);
  })
  .post(
    "/",
    zValidator("json", createUserScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");
      const userId = c.get("userId");

      const isExist = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (isExist) {
        return c.json({ message: "User already exists" }, 409);
      }

      const result = await prisma.user.create({
        data: {
          id: userId,
          display_name: body.display_name,
          icon_uri: body.icon_uri,
          description: body.description,
        },
      });

      return c.json(result);
    },
  )
  .put(
    "/",
    zValidator("json", updateUserScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");

      const result = await prisma.user.update({
        where: {
          id: c.get("userId"),
        },
        data: { ...body },
      });

      return c.json(result);
    }
  )
  .delete("/", async (c) => {
    const result = await prisma.user.delete({
      where: {
        id: c.get("userId"),
      },
    });
    return c.json(result);
  });