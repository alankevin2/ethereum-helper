// Import all dependencies, mostly using destructuring for better view.
import { ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';

import handleMessage from './linebot_commands';
import db from './db';

let userIDHash: { [key: string]: string } = {};

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

// Create a new LINE SDK client.
const client = new Client(clientConfig);

const app: Application = express();

const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text' || !event.source.userId) {
    return;
  }

  const { replyToken, source } = event;
  const userLineID = source.userId!;

  let userID = userIDHash[userLineID];
  if (!userID) {
    const exist = await db.instance.isUserExist(userLineID);
    if (!exist || exist instanceof Error) {
        await db.instance.insertUser(userLineID);
    }
    userID = await db.instance.selectUserID(userLineID);
    userIDHash[userLineID] = userID;
  }

  const text = await handleMessage(userID, userLineID, replyToken, event.message.text);  
  const response: TextMessage = {
    type: 'text',
    text,
  };

  await client.replyMessage(replyToken, response);
};

// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.get(
  '/',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'Connected successfully!',
    });
  }
);

// This route is used for the Webhook.
app.post(
  '/webhook',
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;

    // Process all of the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }
          // Return an error message.
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
  setInterval(() => {
    userIDHash = {};
  }, 1000 * 60 * 60 * 24);
  // 每天重置hash以免記憶體過大
});
