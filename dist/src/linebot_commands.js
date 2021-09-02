"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get_price_by_symbol_1 = (0, tslib_1.__importDefault)(require("./get_price_by_symbol"));
const get_gas_fee_of_ethereum_1 = (0, tslib_1.__importDefault)(require("./get_gas_fee_of_ethereum"));
const get_wallet_balance_1 = (0, tslib_1.__importDefault)(require("./get_wallet_balance"));
const db_1 = (0, tslib_1.__importDefault)(require("./db"));
// types and enums
var LineBotCommands;
(function (LineBotCommands) {
    LineBotCommands["SET_WALLET"] = "/set wallet";
    LineBotCommands["REMOVE_WALLET"] = "/mv wallet";
    LineBotCommands["GET_WALLETS"] = "/wallets";
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
    if (!params.parameters[0]) {
        reply = `${reply}：沒有設置地址`;
        return reply;
    }
    try {
        await db_1.default.instance.insertWallet(params.line_uid, params.parameters[0], params.parameters[1] || '');
    }
    catch {
        return reply;
    }
    reply = '設置成功';
    return reply;
}
async function removeWallet(params) {
    let reply = '移除錢包失敗';
    return reply;
}
async function getWallets(params) {
    let reply = '你的錢包：';
    return reply;
}
;
async function getBalance(params) {
    // 從資料庫拿取錢包
    const wallets = await db_1.default.instance.selectWallets(params.user_id);
    let target;
    let addressOrNickname = params.parameters[0];
    let reply = '取得餘額失敗';
    // 有無下達關鍵字，並嘗試找到符合的
    if (addressOrNickname) {
        wallets.forEach(eachw => {
            if (eachw.nickname == addressOrNickname || eachw.address == addressOrNickname) {
                target = eachw;
            }
        });
    }
    // 沒有任何錢包，就失敗
    if (wallets.length == 0) {
        reply = `${reply}: 您沒有設置任何錢包`;
        return reply;
    }
    // 沒有找到符合的，就拿第一筆錢包
    if (!target) {
        target = wallets[0];
    }
    const balance = await (0, get_wallet_balance_1.default)(target.address);
    const nickname = target.nickname;
    reply = `錢包：${nickname}\n餘額：${balance}`;
    return reply;
}
async function getPrice(params) {
    let reply = '取得幣價失敗';
    let symbol = params.parameters[0];
    if (!symbol) {
        const user = await db_1.default.instance.selectUser(params.line_uid);
        symbol = user[0].last_query_symbol || '';
    }
    symbol = symbol.toUpperCase();
    try {
        reply = await (0, get_price_by_symbol_1.default)(symbol);
        reply = `${symbol}: ${reply} USD`;
        db_1.default.instance.updateSymbol(params.user_id, symbol);
    }
    catch {
        return reply;
    }
    return reply;
}
async function getGasPrice(params) {
    let reply = '取得Gas Price失敗';
    const gas = await (0, get_gas_fee_of_ethereum_1.default)();
    reply = `${gas} Gwei`;
    return reply;
}
async function handleMessage(user_id, line_uid, replyToken, text) {
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
        user_id,
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
        case LineBotCommands.GET_WALLETS:
            reply = await getWallets(wrapped);
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