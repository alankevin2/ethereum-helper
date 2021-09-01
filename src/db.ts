import MySQL from 'mysql';
import  * as Q  from './db_queries_generator';

type Success = any;

export default class Database {

    private static _instance: Database | null;
    static get instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
            Database._instance.init();
        }
        return Database._instance!;
    }

    private connection: MySQL.Connection | null = null;

    private init() {
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
    }

    async isUserExist(line_user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>((resolve, reject) => {
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
        return new Promise<Error | Success>((resolve, reject) => {
            this.connection!.query(Q.INSERT_USER(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            })
        });
    }

    async selectUserID(line_user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>((resolve, reject) => {
            this.connection!.query(Q.SELECT_USER_ID(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async selectWallets(user_id: string): Promise<Error | Success> {
        return new Promise<Error | Success>((resolve, reject) => {
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
        return new Promise<Error | Success>((resolve, reject) => {
            this.connection!.query(Q.INSERT_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }

    async updateWalletAddress(user_id: string, address: string, nickname: string | null): Promise<Error | Success> {
        return new Promise<Error | Success>((resolve, reject) => {
            this.connection!.query(Q.UPDATE_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        });
    }
}
