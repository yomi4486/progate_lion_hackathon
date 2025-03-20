import { CognitoJwtVerifier } from "aws-jwt-verify";
import { config } from "dotenv";

config();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USERPOOL_ID as string,
  tokenUse: "id",
  clientId: process.env.CLIENT_ID as string,
});

export const verifyJWT = async (token: string): Promise<string | null> => {
  try {
    const payload = await verifier.verify(token);
    return payload.sub;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null
  }
};
