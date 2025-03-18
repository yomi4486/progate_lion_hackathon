import { z } from "zod";

export const createFollowScheme = z.object({
  followee_id: z.string(),
});

export const deleteFollowScheme = z.object({
  followee_id: z.string(),
});
