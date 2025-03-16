import type { Env } from "hono";
import { Hono } from "hono";
import authRoute from "./routes/auth.js";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";

type AppEnv = Env;

const app = new Hono();

app.use("*", logger());
// app.use("*", authMiddleware);

app.get("/", (c) => c.text("Hello, Hono!"));

app.route("/", authRoute);

app.notFound((c) => c.text("Not Found", 404));

serve({
  fetch: app.fetch,
  port: 4000,
});
