"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const linebot_commands_1 = (0, tslib_1.__importDefault)(require("../src/linebot_commands"));
const get_wallet_balance_1 = (0, tslib_1.__importDefault)(require("../src/get_wallet_balance"));
const db_1 = (0, tslib_1.__importDefault)(require("../src/db"));
async function main() {
    // test_handleMessage();
    console.log(await test_getBalance());
}
main();
async function test_handleMessage() {
    (0, linebot_commands_1.default)('123', 'replytoken', '/price BTC')
        .then(v => console.log(v)).catch(err => console.log(err));
}
async function test_setWallet() {
}
async function test_getBalance() {
    const params = {
        line_uid: 'U1f595cafc25711a6a36c48cc455ba270',
        user_id: '65',
        replyToken: '',
        parameters: ['123']
    };
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
//# sourceMappingURL=test.js.map