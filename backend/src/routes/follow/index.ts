import { Hono } from "hono";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocument,
  ScanCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { zValidator } from "@hono/zod-validator";
import dotenv from "dotenv";
import { createFollowScheme, deleteFollowScheme } from "./scheme.js";

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocument.from(client);
const tableName = "relationships";

export const FollowRoute = new Hono<{ Variables: { userId: string } }>()
  .get("/", async (c) => {
    const scanCommand = new ScanCommand({
      TableName: tableName,
    });
    const response = await docClient.send(scanCommand);
    return c.json(response.Items);
  })
  // idがフォローしている人を取得
  .get("/following/:id", async (c) => {
    const id = c.req.param("id");
    const queryCommand = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": id,
      },
    });
    const response = await docClient.send(queryCommand);
    if (!response.Items) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(response.Items);
  })
  //idのフォロワーを取得
  .get("/followers/:id", async (c) => {
    const id = c.req.param("id");
    const queryCommand = new QueryCommand({
      TableName: tableName,
      IndexName: "followee_id-index",
      KeyConditionExpression: "followee_id = :followee_id",
      ExpressionAttributeValues: {
        ":followee_id": id,
      },
    });
    const response = await docClient.send(queryCommand);
    if (!response.Items) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(response.Items);
  })
  .post(
    "/",
    zValidator("json", createFollowScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");
      const putCommand = new PutCommand({
        TableName: tableName,
        Item: {
          user_id: c.get("userId"),
          followee_id: body.followee_id,
        },
      });
      const response = await docClient.send(putCommand);
      return c.json(response);
    },
  )
  .delete(
    "/",
    zValidator("json", deleteFollowScheme, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request" }, 400);
      }
    }),
    async (c) => {
      const body = c.req.valid("json");
      const deleteCommand = new DeleteCommand({
        TableName: tableName,
        Key: {
          user_id: c.get("userId"),
          followee_id: body.followee_id,
        },
      });
      const response = await docClient.send(deleteCommand);
      return c.json(response);
    },
  );
