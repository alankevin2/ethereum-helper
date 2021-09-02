const TABLES = {
    USERS: '\`users\`',
    WALLETS: '\`wallets\`',
}

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
}

// create tables related

export const CREATE_TABLE_USERS = 
    `CREATE TABLE IF NOT EXISTS ${TABLES.USERS} (
        \`id\` INT unsigned NOT NULL AUTO_INCREMENT,
        ${FIELDS.LINE_LAST_REPLY_TOKEN} TEXT(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        ${FIELDS.LINE_USER_ID} TEXT(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        ${FIELDS.LAST_QUERY_SYMBOL} TEXT(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        PRIMARY KEY (\`id\`)
    );`;

export const CREATE_TABLE_WALLETS = 
    `CREATE TABLE IF NOT EXISTS ${TABLES.WALLETS} (
        \`id\` INT unsigned NOT NULL AUTO_INCREMENT,
        ${FIELDS.NICKNAME} VARCHAR(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        ${FIELDS.ADDRESS} TEXT(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        ${FIELDS.CHAIN} TEXT(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        ${FIELDS.USER_ID} INT unsigned NOT NULL,
        PRIMARY KEY (\`id\`, ${FIELDS.NICKNAME})
    );`;

// users related


export const SELECT_ALL_USERS = `SELECT * FROM ${TABLES.USERS} WHERE 1 LIMIT 100`;

export function IS_USER_EXISTS(line_user_id: string): string {
    return `SELECT * FROM ${TABLES.USERS} WHERE ${TABLES.USERS}.\`line_user_id\` = \"${line_user_id}\" LIMIT 1`;
}

export function INSERT_USER(line_user_id: string): string {
    return `INSERT INTO ${TABLES.USERS} (${FIELDS.LINE_USER_ID}) VALUES (\"${line_user_id}\");`;
}

export function SELECT_USER(line_user_id: string): string {
    return `SELECT * FROM ${TABLES.USERS} WHERE ${FIELDS.LINE_USER_ID} = \"${line_user_id}\" LIMIT 1`;
}

export function UPDATE_LAST_QUERY_SYMBOL(line_user_id: string, symbol: string): string {
    return `UPDATE ${TABLES.USERS} SET ${FIELDS.LAST_QUERY_SYMBOL} = \"${symbol}\" WHERE ${FIELDS.LINE_USER_ID} = \"${line_user_id}\"`;
}

export function SELECT_LAST_QUERY_SYMBOL(line_user_id: string): string {
    return `SELECT ${FIELDS.LAST_QUERY_SYMBOL} FROM ${TABLES.USERS} WHERE ${FIELDS.LINE_USER_ID} = ${line_user_id} LIMIT 1`;
}

export function DELETE_USER(line_user_id: string): string {
    return `DELETE FROM ${TABLES.USERS} WHERE ${FIELDS.LINE_USER_ID} = \"${line_user_id}\"`;
}


// wallet related

export function INSERT_WALLET(user_id: string, address: string, nickname: string | null) {
    return `INSERT INTO ${TABLES.WALLETS} SET 
    ${FIELDS.ADDRESS} = \"${address}\",
    ${FIELDS.NICKNAME} = \"${nickname ? nickname : ""}\", 
    ${FIELDS.USER_ID} = ${user_id}`;
}

export function UPDATE_WALLET(user_id: string, address: string, nickname: string | null) {
    return `UPDATE ${TABLES.WALLETS} SET 
    ${FIELDS.ADDRESS} = \"${address}\",
    ${FIELDS.NICKNAME} = \"${nickname ? nickname : ""}\" 
    WHERE ${FIELDS.USER_ID} = ${user_id}`;
}

export function SELECT_WALLETS(user_id: string): string {
    return `SELECT ${FIELDS.ADDRESS}, ${FIELDS.NICKNAME} FROM ${TABLES.WALLETS} WHERE ${FIELDS.USER_ID} = ${user_id}`;
}

export function DELETE_WALLET(user_id: string, nickname: string): string {
    return ``;
}