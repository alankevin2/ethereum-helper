import Web3 from 'web3';
import request from 'request-promise';
import getGasFee from './get_gas_fee_of_ethereum';
import getPrice from './get_price_by_symbol';

import db from './db';

const infura = 'wss://mainnet.infura.io/ws/v3/b633a6af7b8b496596ca35b83eb4712e'
const web3 = new Web3(new Web3.providers.WebsocketProvider(infura));
enum FiatRatesForTWD {
    USDT = 28
}

export default async function showGasFeeInTWD(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const gasfee = await getGasFee();
        const ethPriceInUSD = await getPrice('ETH');
        console.log(`gasFee:${gasfee}`);
        console.log(`ethPrice: ${ethPriceInUSD}`);
        const price = Number(gasfee) * Number(ethPriceInUSD)
        resolve(price.toString());
    });
}

// showGasFeeInTWD().then( v => { console.log(v) });

// db.instance.isUserExist('123').then(async result => {
//     console.log(`is user exist ? ${result}`);
//     const insertResult = await db.instance.insertUser('123');
//     console.log(insertResult);
//     const selectResult = await db.instance.isUserExist('123');
//     console.log(selectResult);
// });

db.instance.selectUserID('123').then(async (v) => {
    console.log(v);

    const res = await db.instance.selectWallets(v[0]['id']);
    console.log(res);
    const a = await db.instance.insertWallet(v[0]['id'], 'address', '123wallet')
    console.log(a);
    const b = await db.instance.selectWallets(v[0]['id']);
    console.log(b);
});