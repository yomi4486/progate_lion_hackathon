import { z } from "zod";

export const createRelationshipScheme = z.object({
    id: z.string().uuid(),
    followed_id: z.string(),
})