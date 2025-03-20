import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { Hono } from "hono";
import { config } from "dotenv";
import { verifyJWT } from "./middleware.js";
import { UserRoute } from "./routes/user/index.js";
import { FollowRoute } from "./routes/follow/index.js";
import { RoomRoute } from "./routes/room/index.js";
import { CommentRoute } from "./routes/comment/index.js";

config();

const app = new Hono<{ Variables: { userId: string } }>()
  .use("*", logger())
  .use("*", async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    const token = authHeader.split(" ")[1];
    const result = await verifyJWT(token);
    if (result === null) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    c.set("userId", result);
    await next();
  })
  .get("/", (c) => c.text("Hello, Hono!"))
  .route("/users", UserRoute)
  .route("/follow", FollowRoute)
  .route("/room", RoomRoute)
  .route("/comment", CommentRoute)
  .notFound((c) => c.text("Not Found", 404));

export const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.info(`Server is running on http://localhost:${info.port}`);
  },
);

export const closeServer = () => {
  server.close();
};
export type AppType = typeof app;
export default app;
