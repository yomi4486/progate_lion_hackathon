import { z } from "zod";

export const createRelationshipScheme = z.object({
    followee_id: z.string(),
});

export const deleteRelationshipScheme = z.object({
    followee_id: z.string(),
});