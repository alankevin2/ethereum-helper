"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get_price_by_symbol_1 = (0, tslib_1.__importDefault)(require("./get_price_by_symbol"));
// types and enums
var LineBotCommands;
(function (LineBotCommands) {
    LineBotCommands["SET_WALLET"] = "/set wallet";
    LineBotCommands["REMOVE_WALLET"] = "/mv wallet";
    LineBotCommands["GET_BALANCE"] = "/balance";
    LineBotCommands["GET_PRICE"] = "/price";
    LineBotCommands["GET_ETH_GAS_PRICE"] = "/gas";
    LineBotCommands["GET_ETH_GAS_FEE"] = "/gasfee";
    LineBotCommands["SUBSCRIBE_GAS_PRICE_LOW"] = "/subgas";
    LineBotCommands["HELP"] = "/help";
})(LineBotCommands || (LineBotCommands = {}));
// functions
async function setWallet(params) {
    let reply = '設置錢包失敗';
    if (!params.line_uid) {
        return reply;
    }
    return reply;
}
async function removeWallet(params) {
    let reply = '移除錢包失敗';
    return reply;
}
async function getBalance(params) {
    let reply = '取得餘額失敗';
    return reply;
}
async function getPrice(params) {
    let reply = '取得幣價失敗';
    reply = await (0, get_price_by_symbol_1.default)(params.parameters[0]);
    return reply;
}
async function getGasPrice(params) {
    let reply = '取得Gas Price失敗';
    return reply;
}
async function handleMessage(line_uid, replyToken, text) {
    let reply = `指令錯誤或解析失敗，很抱歉幫不上忙 :(
        你可以試試以下指令：
        ${LineBotCommands.GET_BALANCE}
        ${LineBotCommands.GET_PRICE}
        ${LineBotCommands.GET_ETH_GAS_PRICE}
        ${LineBotCommands.HELP}`;
    if (typeof text !== 'string') {
        return reply;
    }
    const commands = text.split(' ')[0];
    const parameters = text.split(' ').splice(1);
    const wrapped = {
        line_uid,
        replyToken,
        parameters
    };
    switch (commands) {
        case LineBotCommands.SET_WALLET:
            reply = await setWallet(wrapped);
            break;
        case LineBotCommands.REMOVE_WALLET:
            reply = await removeWallet(wrapped);
            break;
        case LineBotCommands.GET_BALANCE:
            reply = await getBalance(wrapped);
            break;
        case LineBotCommands.GET_PRICE:
            reply = await getPrice(wrapped);
            break;
        case LineBotCommands.GET_ETH_GAS_PRICE:
            reply = await getGasPrice(wrapped);
            break;
        case LineBotCommands.GET_ETH_GAS_FEE:
        case LineBotCommands.SUBSCRIBE_GAS_PRICE_LOW:
            reply = '此功能coming soon';
            break;
        case LineBotCommands.HELP:
            break;
    }
    return reply;
}
exports.default = handleMessage;
//# sourceMappingURL=linebot_commands.js.map