import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Context, Next } from "hono";

const jwks = createRemoteJWKSet(new URL(process.env.JWKS_URL!));

export const verifyJWT = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, jwks);

    c.set("user", {
      ...payload,
      accessToken: token,
    });

    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return c.json({ error: "Unauthorized: Invalid token" }, 401);
  }
};
