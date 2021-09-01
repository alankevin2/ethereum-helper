"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const web3_1 = (0, tslib_1.__importDefault)(require("web3"));
const get_gas_fee_of_ethereum_1 = (0, tslib_1.__importDefault)(require("./get_gas_fee_of_ethereum"));
const get_price_by_symbol_1 = (0, tslib_1.__importDefault)(require("./get_price_by_symbol"));
const db_1 = (0, tslib_1.__importDefault)(require("./db"));
const infura = 'wss://mainnet.infura.io/ws/v3/b633a6af7b8b496596ca35b83eb4712e';
const web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(infura));
var FiatRatesForTWD;
(function (FiatRatesForTWD) {
    FiatRatesForTWD[FiatRatesForTWD["USDT"] = 28] = "USDT";
})(FiatRatesForTWD || (FiatRatesForTWD = {}));
async function showGasFeeInTWD() {
    return new Promise(async (resolve, reject) => {
        const gasfee = await (0, get_gas_fee_of_ethereum_1.default)();
        const ethPriceInUSD = await (0, get_price_by_symbol_1.default)('ETH');
        console.log(`gasFee:${gasfee}`);
        console.log(`ethPrice: ${ethPriceInUSD}`);
        const price = Number(gasfee) * Number(ethPriceInUSD);
        resolve(price.toString());
    });
}
exports.default = showGasFeeInTWD;
// showGasFeeInTWD().then( v => { console.log(v) });
// db.instance.isUserExist('123').then(async result => {
//     console.log(`is user exist ? ${result}`);
//     const insertResult = await db.instance.insertUser('123');
//     console.log(insertResult);
//     const selectResult = await db.instance.isUserExist('123');
//     console.log(selectResult);
// });
db_1.default.instance.selectUserID('123').then(async (v) => {
    console.log(v);
    const res = await db_1.default.instance.selectWallets(v[0]['id']);
    console.log(res);
    const a = await db_1.default.instance.insertWallet(v[0]['id'], 'address', '123wallet');
    console.log(a);
    const b = await db_1.default.instance.selectWallets(v[0]['id']);
    console.log(b);
});
//# sourceMappingURL=eth_test.js.map