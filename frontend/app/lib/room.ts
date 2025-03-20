import { AppType } from "../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import type { InferRequestType, InferResponseType } from "hono/client";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);

export async function get_room(
  idToken: string,
): Promise<InferResponseType<typeof client.room.$post, 200> | null> {
  try {
    const res = await client.room.$post({
      headers: { Authorization: `Bearer ${idToken}` },
    });
    console.log(res);
    if (!res.ok) return null;
    const jsonContent = await res.json();
    return jsonContent;
  } catch (e) {
    console.error(e);
    return null;
  }
}
