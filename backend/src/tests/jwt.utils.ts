import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export function createTestToken(userId: string = "test-user-id"): string {
  const secret: Secret = "test-secret-key";

  const options: SignOptions = {
    algorithm: "HS256",
  };

  return jwt.sign({ userId }, secret, options);
}
