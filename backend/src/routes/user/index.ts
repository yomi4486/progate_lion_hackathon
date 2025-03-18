import { Hono } from 'hono';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {  DynamoDBDocument, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

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

export const UserRoute = new Hono()
    .get('/', async(c) => {
        const scanCommand = new ScanCommand({
            TableName: tableName,
        });
        const response = await docClient.send(scanCommand);
        return c.json(response.Items);
    })