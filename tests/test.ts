import Web3 from 'web3';
import request from 'request-promise';
import getGasFee from '../src/get_gas_fee_of_ethereum';
import getPrice from '../src/get_price_by_symbol';
import handleMessage from '../src/linebot_commands';
import getBlance from '../src/linebot_commands';
import getBalanceFromEthereum from '../src/get_wallet_balance';
import getPriceFromCoinBase from '../src/get_price_by_symbol';
import db from '../src/db';

const params = {
    line_uid: '123',
    user_id: '65',
    replyToken: '',
    parameters: ['']
}

async function main() {
    // test_handleMessage();
    // console.log(await test_getBalance());
    console.log(await test_getPrice());
}

main();

async function test_getBalance() {
    
    const wallets: any[] = await db.instance.selectWallets(params.user_id);
    console.log(wallets);
    let target: any;
    let addressOrNickname = params.parameters[0];
    let reply = '取得餘額失敗';

    // 有無下達關鍵字，並嘗試找到符合的
    if (addressOrNickname) {
        wallets.forEach( eachw => {
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

    const balance: string = await getBalanceFromEthereum(target.address);
    const nickname: string = target.nickname;
    reply = `錢包：${nickname} \n餘額：${balance}`;
    return reply;
}

async function test_getPrice() {
    let reply = '取得幣價失敗';
    let symbol = params.parameters[0];
    if (!symbol) {
        const user: any = await db.instance.selectUser(params.line_uid);
        console.log(user);
        symbol = user[0].last_query_symbol || '';
    }

    try {
        reply = await getPriceFromCoinBase(symbol);
        reply = `${params.parameters[0]}: ${reply} USD`;
    } catch {
        return reply;
    }
    return reply;
}