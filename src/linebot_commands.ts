import getPriceFromCoinBase from './get_price_by_symbol';
import getGasPriceFromEthereum from './get_gas_fee_of_ethereum';
import getBalanceFromEthereum from './get_wallet_balance';
import db from './db';
// types and enums

enum LineBotCommands {
    SET_WALLET = '/set wallet',
    REMOVE_WALLET = '/mv wallet',
    GET_WALLETS = '/wallets',
    GET_BALANCE = '/balance',
    GET_PRICE = '/price',
    GET_ETH_GAS_PRICE = '/gas',
    GET_ETH_GAS_FEE = '/gasfee',
    SUBSCRIBE_GAS_PRICE_LOW = '/subgas',
    HELP = '/help',
}

type CommandParameters = {
    user_id: string,
    line_uid: string,
    replyToken: string,
    parameters: string[],
}

// functions

async function setWallet(params: CommandParameters): Promise<string> {
    let reply = '設置錢包失敗';
    if (!params.parameters[0]) {
        reply = `${reply}：沒有設置地址`;
        return reply;
    }
    
    try {
        await db.instance.insertWallet(params.line_uid, params.parameters[0], params.parameters[1] || '');
    } catch {
        return reply;
    }
    reply = '設置成功';
    return reply;
}

async function removeWallet(params: CommandParameters): Promise<string> {
    let reply = '移除錢包失敗';
    return reply;
}

async function getWallets(params: CommandParameters): Promise<string> {
    let reply = '你的錢包：';
    return reply;
};

async function getBalance(params: CommandParameters): Promise<string> {
    // 從資料庫拿取錢包
    const wallets: any[] = await db.instance.selectWallets(params.user_id);
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
    reply = `錢包：${nickname}\n餘額：${balance}`;
    return reply;
}

async function getPrice(params: CommandParameters): Promise<string> {
    let reply = '取得幣價失敗';
    let symbol = params.parameters[0];
    if (!symbol) {
        const user: any = await db.instance.selectUser(params.line_uid);
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

async function getGasPrice(params: CommandParameters): Promise<string> {
    let reply = '取得Gas Price失敗';
    const gas = await getGasPriceFromEthereum();
    reply = `${gas} Gwei`;
    return reply;
}


export default
async function handleMessage(user_id: string, line_uid: string, replyToken:string, text: string): Promise<string> {
    let reply: string = `指令錯誤或解析失敗，很抱歉幫不上忙 :(
        你可以試試以下指令：
        ${LineBotCommands.GET_BALANCE}
        ${LineBotCommands.GET_PRICE}
        ${LineBotCommands.GET_ETH_GAS_PRICE}
        ${LineBotCommands.HELP}`;
    
    if (typeof text !== 'string') {
        return reply;
    }

    const commands = text.split(' ')[0];
    const parameters: string[] = text.split(' ').splice(1);
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