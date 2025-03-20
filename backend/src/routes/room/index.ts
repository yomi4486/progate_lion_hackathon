import { Hono } from "hono";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk"
import { uuid } from "uuidv4"
import dotenv from "dotenv";

dotenv.config();

const livekitHost = "https://progatehackathon-0vilmkur.livekit.cloud";
const roomService = new RoomServiceClient(livekitHost, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);
const RoomRoute = new Hono<{ Variables: { userId: string } }>()
    .post("/",
        async (c) => {
            try {
                const room = await roomService.createRoom({
                    name: uuid(),
                    emptyTimeout: 10 * 60, // 10 minutes
                    maxParticipants: 100,
                })
                return c.json(room)
            } catch (e) {
                console.error(e)
                return c.json({ message: "Failed to create room" }, 500)
            }
        }
    )
    .delete("/:id", async (c) => {
        const roomId = c.req.param("id")
        try {
            await roomService.deleteRoom(roomId)
        } catch (e) {
            console.error(e)
            return c.json({ message: "Failed to delete room" }, 500)
        }
    })