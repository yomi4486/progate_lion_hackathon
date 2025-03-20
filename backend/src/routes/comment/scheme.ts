import { z } from 'zod';

export const createCommentScheme = z.object({
    comment: z.string().max(256),
    video_position: z.number(),
    created_at: z.string().datetime(),
})