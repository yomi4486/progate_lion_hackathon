import { z } from 'zod';

export const createTokenScheme = z.object({
    roomName: z.string(),
})