import { z } from "zod";

export const createUserScheme = z.object({
    sub: z.string()
})