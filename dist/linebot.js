"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Import all dependencies, mostly using destructuring for better view.
const bot_sdk_1 = require("@line/bot-sdk");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const web3_1 = (0, tslib_1.__importDefault)(require("web3"));
// ts-ignore
const web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/b633a6af7b8b496596ca35b83eb4712e'));
const wallet = '0x2E43f6EB26d9659b8c4eD86C840F6C45c60f2211';
const getBalance = async function () {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(wallet, (err, balance) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            console.log(web3.utils.fromWei(balance));
            resolve(web3.utils.fromWei(balance));
        });
    });
};
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
// Create a new Express application.
const app = (0, express_1.default)();
// Function handler to receive the text.
const textEventHandler = async (event) => {
    // Process all variables here.
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }
    // Process all message related variables here.
    const { replyToken } = event;
    const { text } = event.message;
    // Create a new message.
    const response = {
        type: 'text',
        text,
    };
    // Reply to the user.
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
        wallet,
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
    const balance = await getBalance();
    // Return a successfull message.
    return res.status(200).json({
        status: 'success',
        results,
        balance,
    });
});
// Create a server and listen to it.
app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});
//# sourceMappingURL=linebot.js.map