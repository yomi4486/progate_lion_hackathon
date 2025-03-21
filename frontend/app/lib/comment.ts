import { AppType } from "../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import type { InferRequestType, InferResponseType } from "hono/client";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);

const getFromRoomId = client.comments[":roomId"];
const postFromRoomId = client.comments[":roomId"];
const updateFromRoomIdAndCommentId = client.comments[":roomId"][":commentId"];
const deleteFromRoomIdAndCommentId = client.comments[":roomId"][":commentId"];

export async function getComment(
    idToken: string,
    roomId: string
): Promise<InferResponseType<typeof getFromRoomId.$get, 200> | null> {
    try {
        const res = await client.comments[":roomId"].$get(
            {
                param: { roomId: roomId },
            },
            { headers: { Authorization: `Bearer ${idToken}` } },
        );
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("Failed request");
        const jsonContent = await res.json();
        return jsonContent;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function createCommnet(
    idToken: string,
    comment: string,
    videoPosition: number,
    roomId: string
): Promise<InferResponseType<typeof postFromRoomId.$post, 200> | null> {
    try {
        const res = await client.comments[":roomId"].$post(
            {
                json: {
                    comment: comment,
                    video_position: videoPosition
                },
                param: { roomId: roomId },
            },
            {
                headers: { Authorization: `Bearer ${idToken}`}
            }
        );
        if (!res.ok) throw new Error("Failed request");
        const jsonContent = await res.json();
        return jsonContent;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function updateComment(
    idToken: string,
    roomId: string,
    commentId: string,
    comment: string,
): Promise<InferResponseType<typeof updateFromRoomIdAndCommentId.$put, 200> | null> {
    try {
        const res = await client.comments[":roomId"][":commentId"].$put(
            {
                json: {
                    comment: comment
                },
                param: { roomId: roomId, commentId: commentId }
            },
            {
                headers: { Authorization: `Bearer ${idToken}` }
            }
        )
        if (!res.ok) throw new Error("Failed request");
        const jsonContent = await res.json();
        return jsonContent;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function deleteComment(
    idToken: string,
    roomId: string,
    commentId: string,
): Promise<InferResponseType<typeof deleteFromRoomIdAndCommentId.$delete, 200> | null> {
    try {
        const res = await client.comments[":roomId"][":commentId"].$delete(
            {
                param: { roomId: roomId, commentId: commentId }
            },
            {
                headers: { Authorization: `Bearer ${idToken}` }
            }
        )
        if (!res.ok) throw new Error("Failed request");
        const jsonContent = await res.json();
        return jsonContent;
    } catch (e) {
        console.error(e);
        return null;
    }
}