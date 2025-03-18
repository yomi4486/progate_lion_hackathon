import { Hono } from 'hono';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {  DynamoDBDocument, GetCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { zValidator } from '@hono/zod-validator';
import dotenv from 'dotenv';
import { createUserScheme } from './scheme.js';

dotenv.config();

const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }
})

const docClient = DynamoDBDocument.from(client);
const tableName = "users";

export const UserRoute = new Hono<{ Variables: { userId: string}}>()
    .get('/', async(c) => {
        const scanCommand = new ScanCommand({
            TableName: tableName,
        });
        const response = await docClient.send(scanCommand);
        return c.json(response.Items);
    })
    .get('/:id', async(c) => {
        const id = c.get('userId');
        const getCommnad = new GetCommand({
            TableName: tableName,
            Key: {
                sub: id
            }
        });
        const response = await docClient.send(getCommnad);
        if (!response.Item) {
            return c.json({ message: "User not found" }, 404);
        }
        return c.json({ user: response.Item }, 200);
    })
    .post('/', 
        zValidator('json', createUserScheme, (result, c) => {
            if (!result.success) {
                return c.json({ message: "Invalid request" }, 400);
            }
        }),
        async(c) => {
            const body = c.req.valid('json');
            const putCommand = new PutCommand({
            TableName: tableName,
            Item: {
                sub: c.get('userId'),
                display_name: body.display_name,
                icon_uri: body.icon_uri,
                description: body.description
            }
        });
        await docClient.send(putCommand);
        return c.json({ message: "User created" });
    })