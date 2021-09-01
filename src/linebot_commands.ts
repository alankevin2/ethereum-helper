import getPriceFromCoinBase from './get_price_by_symbol';

// types and enums

enum LineBotCommands {
    SET_WALLET = '/set wallet',
    REMOVE_WALLET = '/mv wallet',
    GET_BALANCE = '/balance',
    GET_PRICE = '/price',
    GET_ETH_GAS_PRICE = '/gas',
    GET_ETH_GAS_FEE = '/gasfee',
    SUBSCRIBE_GAS_PRICE_LOW = '/subgas',
    HELP = '/help',
}

type CommandParameters = {
    line_uid: string | undefined,
    replyToken: string,
    parameters: string[],
}

// functions

async function setWallet(params: CommandParameters): Promise<string> {
    let reply = '設置錢包失敗';

    if (!params.line_uid) {
        return reply;
    }

    return reply;
}

async function removeWallet(params: CommandParameters): Promise<string> {
    let reply = '移除錢包失敗';
    return reply;
}

async function getBalance(params: CommandParameters): Promise<string> {
    let reply = '取得餘額失敗';
    return reply;
}

async function getPrice(params: CommandParameters): Promise<string> {
    let reply = '取得幣價失敗';
    reply = await getPriceFromCoinBase(params.parameters[0]);
    return reply;
}

async function getGasPrice(params: CommandParameters): Promise<string> {
    let reply = '取得Gas Price失敗';
    return reply;
}


export default
async function handleMessage(line_uid: string | undefined, replyToken:string, text: string): Promise<string> {
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