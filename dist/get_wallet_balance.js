"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const web3_1 = (0, tslib_1.__importDefault)(require("web3"));
const web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(process.env.INFURA_URL));
// const wallet = '0x2E43f6EB26d9659b8c4eD86C840F6C45c60f2211';
async function getBalance(address) {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, (err, balance) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(web3.utils.fromWei(balance));
        });
    });
}
exports.default = getBalance;
//# sourceMappingURL=get_wallet_balance.js.map