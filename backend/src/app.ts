import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import * as authMiddlewares from "./controllers/authMiddleware.js";

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
