import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { Hono } from "hono";
import dotenv from "dotenv";
import * as authMiddlewares from "./controllers/middleware.js";
import { UserRoute } from "./routes/user/index.js";

dotenv.config();

const app = new Hono()
  .use("*", logger())
  .use("*", authMiddlewares.verifyJWT)
  .get("/", (c) => c.text("Hello, Hono!"))
  .route("/users", UserRoute)
  .notFound((c) => c.text("Not Found", 404));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.info(`Server is running on http://localhost:${info.port}`);
  },
);

export type AppType = typeof app;
export default app;
