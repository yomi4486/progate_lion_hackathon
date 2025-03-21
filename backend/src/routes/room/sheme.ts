import { z } from "zod";

export const createRoomScheme = z.object({
    room_title: z.string().min(1).max(256),
    room_description: z.string().max(256),
    room_thumbnail: z.string(),
    room_tags: z.array(z.string()),
})