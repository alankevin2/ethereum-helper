"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mysql_1 = (0, tslib_1.__importDefault)(require("mysql"));
const Q = (0, tslib_1.__importStar)(require("./db_queries_generator"));
class Database {
    static _instance;
    static get instance() {
        if (!Database._instance) {
            Database._instance = new Database();
        }
        return Database._instance;
    }
    connection;
    keepAliveInterval;
    constructor() {
        this.connection = mysql_1.default.createConnection(process.env.DATABASE_URL);
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
                        this.connection = mysql_1.default.createConnection(process.env.DATABASE_URL);
                        keepalive();
                    });
                });
            }, 5000);
        };
        keepalive();
    }
    async selectAllUsers() {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.SELECT_ALL_USERS, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async isUserExist(line_user_id) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.IS_USER_EXISTS(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length > 0 ? true : Error('sql success but no user found'));
            });
        });
    }
    async insertUser(line_user_id) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.INSERT_USER(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async selectUser(line_user_id) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.SELECT_USER(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length > 0 ? result[0] : Error('no user found'));
            });
        });
    }
    async updateSymbol(user_id, symbol) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.UPDATE_LAST_QUERY_SYMBOL(user_id, symbol), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async selectWallets(user_id) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.SELECT_WALLETS(user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async insertWallet(user_id, address, nickname) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.INSERT_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async deleteWallet(user_id, nickname) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.DELETE_WALLET(user_id, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async updateWalletAddress(user_id, address, nickname) {
        return new Promise(async (resolve, reject) => {
            this.connection.query(Q.UPDATE_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async checkConnection() {
        try {
            if (this.connection.state != 'authenticated' && this.connection.state != 'connected') {
                this.connection = mysql_1.default.createConnection(process.env.DATABASE_URL);
            }
        }
        catch (err) {
            console.error('//////////////////////////////////////////');
            console.error(err);
        }
    }
}
exports.default = Database;
//# sourceMappingURL=db.js.map