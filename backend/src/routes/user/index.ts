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
    .get('/:sub', async(c) => {

    })
    .post('/', 
        /*
        zValidator('json', createUserScheme, (result, c) => {
            if (!result.success) {
                return c.json({ message: "Invalid request" }, 400);
            }
        }),
        */
        async(c) => {
        const putCommand = new PutCommand({
            TableName: tableName,
            Item: {
                sub: c.get('userId')
            }
        });
        await docClient.send(putCommand);
        return c.json({ message: "User created" });
    })