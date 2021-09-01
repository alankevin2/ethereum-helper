"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const web3_1 = (0, tslib_1.__importDefault)(require("web3"));
const web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/b633a6af7b8b496596ca35b83eb4712e'));
async function getGasFee() {
    return new Promise(async (resolve, reject) => {
        const gasFeeInWei = await web3.eth.getGasPrice();
        // @ts-ignore
        resolve(web3.utils.fromWei(gasFeeInWei, 'Gwei'));
    });
}
exports.default = getGasFee;
async function getGasEstimate() {
    // interface TransactionConfig {
    //     from?: string | number;
    //     to?: string;
    //     value?: number | string | BN;
    //     gas?: number | string;
    //     gasPrice?: number | string | BN;
    //     data?: string;
    //     nonce?: number;
    //     chainId?: number;
    //     common?: Common;
    //     chain?: string;
    //     hardfork?: string;
    // }
    // new TransactionConfig()
}
//# sourceMappingURL=get_gas_fee_of_ethereum.js.map