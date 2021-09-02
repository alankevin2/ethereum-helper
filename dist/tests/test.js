"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const get_wallet_balance_1 = (0, tslib_1.__importDefault)(require("../src/get_wallet_balance"));
const get_price_by_symbol_1 = (0, tslib_1.__importDefault)(require("../src/get_price_by_symbol"));
const db_1 = (0, tslib_1.__importDefault)(require("../src/db"));
const params = {
    line_uid: '123',
    user_id: '5',
    replyToken: '',
    parameters: ['SOL']
};
async function main() {
    // test_handleMessage();
    // console.log(await test_getBalance());
    console.log(await test_getPrice());
}
main();
async function test_getBalance() {
    const wallets = await db_1.default.instance.selectWallets(params.user_id);
    console.log(wallets);
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
    reply = `錢包：${nickname} \n餘額：${balance}`;
    return reply;
}
async function test_getPrice() {
    let reply = '取得幣價失敗';
    let symbol = params.parameters[0];
    if (!symbol) {
        const user = await db_1.default.instance.selectUser(params.line_uid);
        console.log(user);
        symbol = user[0].last_query_symbol || '';
    }
    try {
        reply = await (0, get_price_by_symbol_1.default)(symbol);
        reply = `${params.parameters[0]}: ${reply} USD`;
        db_1.default.instance.updateSymbol(params.user_id, symbol);
    }
    catch {
        return reply;
    }
    return reply;
}
//# sourceMappingURL=test.js.map