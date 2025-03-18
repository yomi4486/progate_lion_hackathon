import { z } from "zod";

export const createUserScheme = z.object({
    display_name: z.string(),
    icon_uri: z.string(),
    description: z.string()
});