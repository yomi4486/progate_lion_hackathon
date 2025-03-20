import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Context } from "hono";
import { config } from "dotenv";

config();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USERPOOL_ID as string,
  tokenUse: "id",
  clientId: process.env.CLIENT_ID as string,
});

export const verifyJWT = async (c: Context): Promise<string | null> => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifier.verify(token);
    return payload.sub;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null
  }
};
