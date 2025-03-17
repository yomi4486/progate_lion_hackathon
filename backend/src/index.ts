import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { Hono } from "hono";
import dotenv from "dotenv";
import * as authMiddlewares from "./controllers/middleware.js";

dotenv.config();

const app = new Hono();

app.use("*", logger());
app.use("*", authMiddlewares.verifyJWT);

app.get("/", (c) => c.text("Hello, Hono!"));
app.notFound((c) => c.text("Not Found", 404));

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
