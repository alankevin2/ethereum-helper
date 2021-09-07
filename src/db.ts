import MySQL from 'mysql';
import  * as Q  from './db_queries_generator';

type Success = any | boolean | any[];

export default class Database {

    private static _instance: Database | null;
    static get instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
        }
        return Database._instance!;
    }

    private connection: MySQL.Connection;
    private keepAliveInterval: NodeJS.Timeout| undefined;

    constructor() {
        this.connection = MySQL.createConnection(process.env.DATABASE_URL!);
        this.connection.query(Q.CREATE_TABLE_USERS, (error, results, fields) => {
            if (error) {
                console.error(error);
                return;
            }
        });
        this.connection.query(Q.CREATE_TABLE_WALLETS, (error, results, fields) => {
            if (error) {
                console.error(error);
                return;
            }
        });

        const keepalive = () => {
            this.keepAliveInterval && clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = setInterval(() => {
                this.connection.ping(undefined, (err) => {
                    console.log('ping');
                    if (!err) {
                        return;
                    }
                    console.error(err);
                    this.connection.end((didEndOccuredError) => {
                        if (didEndOccuredError) {
                            console.error(didEndOccuredError);
                        }
                        this.connection = MySQL.createConnection(process.env.DATABASE_URL!);
                        keepalive();
                    });
                });
            }, 5000);
        };
        keepalive();
    }

    async selectAllUsers(): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.SELECT_ALL_USERS, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    async isUserExist(line_user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.IS_USER_EXISTS(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length > 0 ? true : Error('sql success but no user found'));
            })
        });
    }

    async insertUser(line_user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.INSERT_USER(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async selectUser(line_user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.SELECT_USER(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length > 0 ? result[0] : Error('no user found'));
            })
        });
    }

    async updateSymbol(user_id: string, symbol: string): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.UPDATE_LAST_QUERY_SYMBOL(user_id, symbol), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async selectWallets(user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.SELECT_WALLETS(user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async insertWallet(user_id: string, address: string, nickname: string | null): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.INSERT_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async deleteWallet(user_id: string, nickname: string) {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.DELETE_WALLET(user_id, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async updateWalletAddress(user_id: string, address: string, nickname: string | null): Promise<Error | Success> {
        return new Promise<Error | Success>(async (resolve, reject) => {
            this.connection!.query(Q.UPDATE_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    private async checkConnection() {
        try {
            if (this.connection!.state != 'authenticated' && this.connection!.state != 'connected') {
                this.connection = MySQL.createConnection(process.env.DATABASE_URL!);
            }
        } catch (err) {
            console.error('//////////////////////////////////////////');
            console.error(err);
        }
    }
}
