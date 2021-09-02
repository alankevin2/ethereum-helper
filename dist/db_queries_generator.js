"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_WALLET = exports.SELECT_WALLETS = exports.UPDATE_WALLET = exports.INSERT_WALLET = exports.DELETE_USER = exports.SELECT_LAST_QUERY_SYMBOL = exports.UPDATE_LAST_QUERY_SYMBOL = exports.SELECT_USER_ID = exports.INSERT_USER = exports.IS_USER_EXISTS = exports.CREATE_TABLE_WALLETS = exports.CREATE_TABLE_USERS = void 0;
const TABLES = {
    USERS: '\`users\`',
    WALLETS: '\`wallets\`',
};
const FIELDS = {
    // USERS
    LINE_USER_ID: '\`line_user_id\`',
    LINE_LAST_REPLY_TOKEN: '\`line_last_reply_token\`',
    LAST_QUERY_SYMBOL: '\`last_query_symbol\`',
    // WALLETS
    ADDRESS: '\`address\`',
    NICKNAME: '\`nickname\`',
    CHAIN: '\`chain\`',
    USER_ID: '\`user_id\`',
};
// create tables related
exports.CREATE_TABLE_USERS = `CREATE TABLE IF NOT EXISTS ${TABLES.USERS} (
        \`id\` INT unsigned NOT NULL AUTO_INCREMENT,
        ${FIELDS.LINE_LAST_REPLY_TOKEN} TEXT(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        ${FIELDS.LINE_USER_ID} TEXT(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        ${FIELDS.LAST_QUERY_SYMBOL} TEXT(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        PRIMARY KEY (\`id\`)
    );`;
exports.CREATE_TABLE_WALLETS = `CREATE TABLE IF NOT EXISTS ${TABLES.WALLETS} (
        \`id\` INT unsigned NOT NULL AUTO_INCREMENT,
        ${FIELDS.NICKNAME} VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        ${FIELDS.ADDRESS} TEXT(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        ${FIELDS.CHAIN} TEXT(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        ${FIELDS.USER_ID} INT unsigned NOT NULL,
        PRIMARY KEY (\`id\`, ${FIELDS.NICKNAME})
    );`;
// users related
function IS_USER_EXISTS(line_user_id) {
    return `SELECT * FROM ${TABLES.USERS} WHERE ${TABLES.USERS}.\`line_user_id\` = \"${line_user_id}\" LIMIT 1`;
}
exports.IS_USER_EXISTS = IS_USER_EXISTS;
function INSERT_USER(line_user_id) {
    return `INSERT INTO ${TABLES.USERS} (${FIELDS.LINE_USER_ID}) VALUES (\"${line_user_id}\");`;
}
exports.INSERT_USER = INSERT_USER;
function SELECT_USER_ID(line_user_id) {
    return `SELECT \`id\` FROM ${TABLES.USERS} WHERE ${FIELDS.LINE_USER_ID} = \"${line_user_id}\" LIMIT 1`;
}
exports.SELECT_USER_ID = SELECT_USER_ID;
function UPDATE_LAST_QUERY_SYMBOL(line_user_id, symbol) {
    return `UPDATE ${TABLES.USERS} SET ${FIELDS.LAST_QUERY_SYMBOL} = \"${symbol}\" WHERE ${FIELDS.LINE_USER_ID} = \"${line_user_id}\"`;
}
exports.UPDATE_LAST_QUERY_SYMBOL = UPDATE_LAST_QUERY_SYMBOL;
function SELECT_LAST_QUERY_SYMBOL(line_user_id) {
    return `SELECT ${FIELDS.LAST_QUERY_SYMBOL} FROM ${TABLES.USERS} WHERE ${FIELDS.LINE_USER_ID} = ${line_user_id} LIMIT 1`;
}
exports.SELECT_LAST_QUERY_SYMBOL = SELECT_LAST_QUERY_SYMBOL;
function DELETE_USER(line_user_id) {
    return `DELETE FROM ${TABLES.USERS} WHERE ${FIELDS.LINE_USER_ID} = \"${line_user_id}\"`;
}
exports.DELETE_USER = DELETE_USER;
// wallet related
function INSERT_WALLET(user_id, address, nickname) {
    return `INSERT INTO ${TABLES.WALLETS} SET 
    ${FIELDS.ADDRESS} = \"${address}\",
    ${FIELDS.NICKNAME} = \"${nickname ? nickname : ""}\", 
    ${FIELDS.USER_ID} = \"${user_id}\"`;
}
exports.INSERT_WALLET = INSERT_WALLET;
function UPDATE_WALLET(user_id, address, nickname) {
    return `UPDATE ${TABLES.WALLETS} SET 
    ${FIELDS.ADDRESS} = \"${address}\",
    ${FIELDS.NICKNAME} = \"${nickname ? nickname : ""}\" 
    WHERE ${FIELDS.USER_ID} = \"${user_id}\"`;
}
exports.UPDATE_WALLET = UPDATE_WALLET;
function SELECT_WALLETS(user_id) {
    return `SELECT ${FIELDS.ADDRESS}, ${FIELDS.NICKNAME} FROM ${TABLES.WALLETS} WHERE ${FIELDS.USER_ID} = \"${user_id}\"`;
}
exports.SELECT_WALLETS = SELECT_WALLETS;
function DELETE_WALLET(user_id, nickname) {
    return ``;
}
exports.DELETE_WALLET = DELETE_WALLET;
//# sourceMappingURL=db_queries_generator.js.map