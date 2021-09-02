import Web3 from 'web3';
import request from 'request-promise';
import getGasFee from '../src/get_gas_fee_of_ethereum';
import getPrice from '../src/get_price_by_symbol';
import handleMessage from '../src/linebot_commands';
import getBlance from '../src/linebot_commands';
import getBalanceFromEthereum from '../src/get_wallet_balance';
import db from '../src/db';

async function main() {
    // test_handleMessage();
    console.log(await test_getBalance());
}

main();

async function test_handleMessage() {
    handleMessage('123', 'replytoken', '/price BTC')
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
    }
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