import { Hono } from "hono";

import * as authControllers from "../controllers/auth.js";
import * as authMiddlewares from "../controllers/authMiddleware.js";

const authRoute = new Hono();

authRoute.get("/protected", authMiddlewares.verifyJWT, (c) => {
  const user = c.get("user");
  return c.json({ message: "Access granted", user });
});

authRoute.post("/logout", authMiddlewares.verifyJWT, async (c) => {
  const user = c.get("user");

  if (!user?.accessToken) {
    return c.json({ error: "No accessToken found" }, 400);
  }

  try {
    await authControllers.logoutUser(user.accessToken);
    return c.json({ message: "Logged out successfully", user });
  } catch (error) {
    console.error("Logout failed:", error);
    return c.json({ error: "Logout failed" }, 500);
  }
});

export default authRoute;
