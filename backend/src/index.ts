import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID as string,
  tokenUse: "access",
  clientId: process.env.CLIENT_ID as string,
})

const app = new Hono()
  .use('*', async(c, next) => {
    try{
      const token = c.req.header('Authorization')
      if (!token) {
        return c.json({message: "Token is required"}, 401)
      }
      const payload = await verifier.verify(token)
      console.log(payload)
    } catch(e) {
        return c.json({ message: "Unauthorized" }, 401)
    }
  })

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

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
