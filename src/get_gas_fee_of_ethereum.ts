import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/b633a6af7b8b496596ca35b83eb4712e'));

export default async function getGasFee(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const gasFeeInWei: string = await web3.eth.getGasPrice();
        // @ts-ignore
        resolve(web3.utils.fromWei(gasFeeInWei, 'Gwei'));
    })
}

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