import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import dotenv from "dotenv";

dotenv.config();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USERPOOL_ID as string,
  tokenUse: "access",
  clientId: process.env.CLIENT_ID as string,
});

const app = new Hono().use("*", async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization")
    if (!authHeader) {
      return c.json({ message: "Unauthorized" }, 401)
    }
    const token = authHeader.split(" ")[1]
    const payload = await verifier.verify(token)
    await next();
  } catch (e) {
    console.error(e)
    return c.json({ message: "Unauthorized" }, 401)
  }
})

app.get("/", (c) => {
  return c.text("Hello Hono!");
})

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
