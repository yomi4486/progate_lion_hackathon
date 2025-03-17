import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Context, Next } from "hono";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USERPOOL_ID as string,
  tokenUse: "id",
  clientId: process.env.CLIENT_ID as string,
});

export const verifyJWT = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized: No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifier.verify(token);

    c.set("user", payload);

    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return c.json({ message: "Unauthorized: Invalid token" }, 401);
  }
};
