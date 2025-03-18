import { z } from "zod";

export const createUserScheme = z.object({
  display_name: z.string().min(1).max(32),
  icon_uri: z.string(),
  description: z.string().max(160),
});

export const updateUserScheme = z.object({
  display_name: z.string().min(1).max(16).optional(),
  icon_uri: z.string().optional(),
  description: z.string().max(160).optional(),
});
