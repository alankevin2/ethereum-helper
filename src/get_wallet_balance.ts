import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/b633a6af7b8b496596ca35b83eb4712e'));
const wallet = '0x2E43f6EB26d9659b8c4eD86C840F6C45c60f2211';

export default async function getBalance() {
    return new Promise<string>((resolve, reject) => {
        web3.eth.getBalance(wallet, (err, balance) => {
            if (err) {
                console.error(err);
                reject(err);
                return
            }
            console.log(web3.utils.fromWei(balance));
            resolve(web3.utils.fromWei(balance))
        });
    });
}