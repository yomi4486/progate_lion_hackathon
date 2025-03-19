import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as userControllers from "../controllers/user.controller.js";

import * as userSchemas from "../models/user.schema.js";

/*
 * GET    /users              - ユーザー情報を取得 (getUser)
 * POST   /users              - 新規ユーザーを作成 (createUser)
 * PUT    /users              - ユーザー情報を更新 (updateUser)
 * GET    /users/following    - 指定ユーザーがフォローしているユーザー一覧を取得 (getFollowing)
 * GET    /users/followers    - 指定ユーザーのフォロワー一覧を取得 (getFollowers)
 */
export const userRoute = new Hono<{ Variables: { userId: string } }>()
  .get("/", async (c) => {
    const cognitoUserId = c.get("userId");

    try {
      const user = await userControllers.getUser(cognitoUserId);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json(user);
    } catch (err) {
      return c.json({ error: (err as Error).message }, 500);
    }
  })
  .post(
    "/",
    zValidator("json", userSchemas.createUser, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Invalid request body" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");

      try {
        const user = await userControllers.createUser({
          cognitoUserId: c.get("userId"),
          displayId: body.display_id,
          displayName: body.display_name,
          bio: body.bio,
          iconImageUrl: body.icon_url,
        });

        return c.json(user, 201);
      } catch (err) {
        return c.json({ error: (err as Error).message }, 500);
      }
    },
  )
  .put(
    "/",
    zValidator("json", userSchemas.updateUser, (result, c) => {
      if (!result.success) {
        return c.json({ error: "Invalid request body" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");

      try {
        const user = await userControllers.updateUser({
          cognitoUserId: c.get("userId"),
          displayId: body.display_id,
          displayName: body.display_name,
          bio: body.bio,
          iconImageUrl: body.icon_url,
        });

        return user ? c.json(user) : c.json({ error: "User not found" }, 404);
      } catch (err) {
        return c.json({ error: (err as Error).message }, 500);
      }
    },
  )
  .get("/following", async (c) => {
    const cognitoUserId = c.get("userId");

    try {
      const following = await userControllers.getFollowing(cognitoUserId);
      return c.json(following);
    } catch (err) {
      return c.json({ error: (err as Error).message }, 500);
    }
  })
  .get("/followers", async (c) => {
    const cognitoUserId = c.get("userId");

    try {
      const followers = await userControllers.getFollowers(cognitoUserId);
      return c.json(followers);
    } catch (err) {
      return c.json({ error: (err as Error).message }, 500);
    }
  });

/*
 * POST   /follow/:id      - フォローする (followUser)
 * DELETE /following/:id   - フォローを解除 (unfollowUser)
 * DELETE /followers/:id   - フォロワーを解除 (removeFollower)
 */
export const followRoute = new Hono<{
  Variables: { userId: string };
}>()
  .post("/follow/:id", async (c) => {
    const followerId = c.get("userId");
    const displayId = c.req.param("id");

    try {
      const followedId =
        await userControllers.getCognitoUserIdByDisplayId(displayId);
      if (!followedId) {
        return c.json({ error: "User not found" }, 404);
      }
      const follow = await userControllers.followUser(followerId, followedId);
      return c.json(follow, 201);
    } catch (err) {
      return c.json({ error: (err as Error).message }, 500);
    }
  })
  .delete("/following/:id", async (c) => {
    const followerId = c.get("userId");
    const displayId = c.req.param("id");

    try {
      const followedId =
        await userControllers.getCognitoUserIdByDisplayId(displayId);
      if (!followedId) {
        return c.json({ error: "User not found" }, 404);
      }
      const success = await userControllers.unfollowUser(
        followerId,
        followedId,
      );
      return c.json({ success });
    } catch (err) {
      return c.json({ error: (err as Error).message }, 500);
    }
  })
  .delete("/followers/:id", async (c) => {
    const followedId = c.get("userId");
    const displayId = c.req.param("id");

    try {
      const followerId =
        await userControllers.getCognitoUserIdByDisplayId(displayId);
      if (!followerId) {
        return c.json({ error: "User not found" }, 404);
      }
      const success = await userControllers.removeFollower(
        followerId,
        followedId,
      );
      return c.json({ success });
    } catch (err) {
      return c.json({ error: (err as Error).message }, 500);
    }
  });
