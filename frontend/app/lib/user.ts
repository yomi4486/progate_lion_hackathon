import { AppType } from "../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import type { InferRequestType, InferResponseType } from "hono/client";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);

const getFromId = client.users[":id"];

export async function get(
  id: string,
): Promise<InferResponseType<typeof getFromId.$get, 200> | null> {
  try {
    const res = await client.users[":id"].$get({
      param: { id: id },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getMyProfile(
  token: string,
): Promise<InferResponseType<typeof client.users.$get, 200> | null> {
  try {
    const res = await client.users.$get({
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function setMyProfile(
  token: string,
  displayName: string,
  iconUri: string,
  description: string,
): Promise<InferResponseType<typeof client.users.$post, 200> | null> {
  try {
    const res = await client.users.$post(
      {
        json: {
          display_name: displayName,
          icon_uri: iconUri,
          description: description,
        },
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function editMyProfile(
  token: string,
  displayName?: string,
  iconUri?: string,
  description?: string,
): Promise<InferResponseType<typeof client.users.$post, 200> | null> {
  if (!displayName && !iconUri && !description) return null;
  try {
    const res = await client.users.$put(
      {
        json: {
          display_name: displayName,
          icon_uri: iconUri,
          description: description,
        },
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}
