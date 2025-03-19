import { z } from "zod";

export const createUser = z.object({
  display_name: z.string().min(1).max(32),
  display_id: z.string().min(1).max(32),
  icon_url: z.string().url(),
  bio: z.string().max(160).optional(),
});

export const updateUser = z.object({
  display_name: z.string().min(1).max(32).optional(),
  display_id: z.string().min(1).max(32),
  icon_url: z.string().url().optional(),
  bio: z.string().max(160).optional(),
});
