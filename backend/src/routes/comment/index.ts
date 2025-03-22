import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createCommentScheme, updateCommentScheme } from "./scheme.js";

config();

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const tableName = "comments";

export const CommentRoute = new Hono<{ Variables: { userId: string } }>()
  .get("/:roomId", async (c) => {
    const roomId = c.req.param("roomId");

    const queryCommand = new QueryCommand({
      TableName: tableName,
      IndexName: "room_id-created_at-index",
      KeyConditionExpression: "room_id = :room_id and created_at < :now_date",
      ExpressionAttributeValues: {
        ":room_id": roomId,
        ":now_date": new Date().toISOString(),
      },
      ScanIndexForward: false,
      Limit: 500,
    });

    const response = await docClient.send(queryCommand);
    return c.json({ comments: response.Items });
  })
  .post(
    "/:roomId",
    zValidator("json", createCommentScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const roomId = c.req.param("roomId");
      const userId = c.get("userId");
      const body = c.req.valid("json");
      const putCommand = new PutCommand({
        TableName: tableName,
        Item: {
          room_id: roomId,
          user_id: userId,
          comment_id: uuidv4(),
          comment: body.comment,
          created_at: new Date().toISOString(),
          video_position: body.video_position,
        },
      });
      const response = await docClient.send(putCommand);
      return c.json(response);
    },
  )
  .put(
    "/:roomId/:commentId",
    zValidator("json", updateCommentScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const roomId = c.req.param("roomId");
      const commentId = c.req.param("commentId");
      const userId = c.get("userId");
      const body = c.req.valid("json");

      const queryCommand = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression:
          "room_id = :room_id AND comment_id = :comment_id",
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":room_id": roomId,
          ":comment_id": commentId,
          ":user_id": userId,
        },
      });

      const queryResponse = await docClient.send(queryCommand);
      if (queryResponse.Count === 0) {
        return c.json({ message: "Comment not found" }, 404);
      }

      const updateExpression: string[] = [];
      const expressionAttributeValues: Record<string, string> = {};
      const expressionAttributeNames: Record<string, string> = {}; // 属性名のエイリアス
      if (body.comment !== undefined) {
        updateExpression.push("#comment = :comment");
        expressionAttributeValues[":comment"] = body.comment;
        expressionAttributeNames["#comment"] = "comment";
      }
      if (updateExpression.length === 0) {
        return c.json({ message: "Invalid request" }, 400);
      }
      const updateCommand = new UpdateCommand({
        TableName: tableName,
        Key: {
          room_id: roomId,
          comment_id: commentId,
        },
        UpdateExpression: `SET ${updateExpression.join(",")}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
      });
      const response = await docClient.send(updateCommand);
      return c.json(response);
    },
  )

  .delete("/:roomId/:commentId", async (c) => {
    const userId = c.get("userId");
    const roomId = c.req.param("roomId");
    const commentId = c.req.param("commentId");

    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "room_id = :room_id AND comment_id = :comment_id",
      FilterExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":room_id": roomId,
        ":comment_id": commentId,
        ":user_id": userId,
      },
    });

    const queryResponse = await docClient.send(queryCommand);

    if (queryResponse.Count === 0) {
      return c.json({ message: "Comment not found" }, 404);
    }

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: {
        room_id: roomId,
        comment_id: commentId,
        user_id: c.get("userId"),
      },
    });
    const response = await docClient.send(deleteCommand);
    return c.json(response);
  });
