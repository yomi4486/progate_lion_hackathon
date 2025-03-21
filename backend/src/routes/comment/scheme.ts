import { z } from "zod";

export const createCommentScheme = z.object({
  comment: z.string().max(256),
  video_position: z.number(),
});

export const updateCommentScheme = z.object({
  comment: z.string().max(256),
});
