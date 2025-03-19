import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { Hono } from "hono";
import dotenv from "dotenv";
import * as userRoutes from "./routes/user.route.js";
import { initDB } from "./db.js";
import { createTestToken } from "./tests/jwt.utils.js";

dotenv.config();

const app = new Hono<{ Variables: { userId: string } }>()
  .use("*", logger())
  // .use("*", authMiddlewares.verifyJWT)
  .get("/", (c) => c.text("Hello, Hono!"))

  //test
  .use("*", (c, next) => {
    c.set("userId", testToken);

    return next();
  })
  .route("/users", userRoutes.userRoute)
  .route("/", userRoutes.followRoute)
  .notFound((c) => c.text("Not Found", 404));

(async () => {
  try {
    await initDB();

    serve(
      {
        fetch: app.fetch,
        port: 3000,
      },
      (info) => {
        console.info(`Server is running on http://localhost:${info.port}`);
      },
    );
  } catch (err) {
    console.error("Failed to initialize DB:", err);
    process.exit(1);
  }
})();

//test
const testToken = createTestToken();
console.info("Generated Test Token:", testToken);

export type AppType = typeof app;
export default app;
