import { AppType } from "../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import type { InferRequestType, InferResponseType } from "hono/client";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);

export async function create_room(
  idToken: string,
  title: string,
  description: string,
  thumbnail: string,
): Promise<InferResponseType<typeof client.room.$post, 200> | null> {
  try {
    const res = await client.room.$post(
      {json:{room_title:title,room_description:description,room_thumbnail:thumbnail,room_tags:[]}},
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    console.log(res.status);
    if (!res.ok) return null;
    const jsonContent = await res.json();
    return jsonContent;
  } catch (e) {
    console.error(e);
    return null;
  }
}
