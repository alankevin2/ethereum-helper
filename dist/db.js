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
            Database._instance.init();
        }
        return Database._instance;
    }
    connection = null;
    init() {
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
    }
    async selectAllUsers() {
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
            this.connection.query(Q.SELECT_USER(line_user_id), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async updateSymbol(user_id, symbol) {
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
            this.connection.query(Q.INSERT_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    async removeWallet(user_id, address, nickname) {
    }
    async updateWalletAddress(user_id, address, nickname) {
        return new Promise((resolve, reject) => {
            this.connection.query(Q.UPDATE_WALLET(user_id, address, nickname), (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
}
exports.default = Database;
//# sourceMappingURL=db.js.map