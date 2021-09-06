"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Import all dependencies, mostly using destructuring for better view.
const bot_sdk_1 = require("@line/bot-sdk");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const linebot_commands_1 = (0, tslib_1.__importDefault)(require("./linebot_commands"));
const db_1 = (0, tslib_1.__importDefault)(require("./db"));
let userIDHash = {};
// Setup all LINE client and Express configurations.
const clientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET,
};
const middlewareConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET || '',
};
const PORT = process.env.PORT || 3000;
// Create a new LINE SDK client.
const client = new bot_sdk_1.Client(clientConfig);
const app = (0, express_1.default)();
const textEventHandler = async (event) => {
    if (event.type !== 'message' || event.message.type !== 'text' || !event.source.userId) {
        return;
    }
    const { replyToken, source } = event;
    const userLineID = source.userId;
    let userID = userIDHash[userLineID];
    if (!userID) {
        const exist = await db_1.default.instance.isUserExist(userLineID);
        if (!exist || exist instanceof Error) {
            await db_1.default.instance.insertUser(userLineID);
        }
        const user = await db_1.default.instance.selectUser(userLineID);
        userIDHash[userLineID] = user[0].id;
        userID = user[0].id;
    }
    const text = await (0, linebot_commands_1.default)(userID, userLineID, replyToken, event.message.text);
    const response = {
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
app.get('/', async (_, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!',
    });
});
// This route is used for the Webhook.
app.post('/webhook', (0, bot_sdk_1.middleware)(middlewareConfig), async (req, res) => {
    const events = req.body.events;
    // Process all of the received events asynchronously.
    const results = await Promise.all(events.map(async (event) => {
        try {
            await textEventHandler(event);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err);
            }
            // Return an error message.
            return res.status(500).json({
                status: 'error',
            });
        }
    }));
    return res.status(200).json({
        status: 'success',
        results,
    });
});
app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
    setInterval(() => {
        userIDHash = {};
    }, 1000 * 60 * 60 * 24);
    // 每天重置hash以免記憶體過大
});
//# sourceMappingURL=linebot.js.map