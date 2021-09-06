"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cheerio_1 = (0, tslib_1.__importDefault)(require("cheerio"));
const request_promise_1 = (0, tslib_1.__importDefault)(require("request-promise"));
// homepage shows latest ranking of popular coin directly, we use this to crawl htmls
const baseURL = process.env.PRICE_SOURCE_URL;
const fakeUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36';
async function getPrice(symbol) {
    return new Promise(async (resolve, reject) => {
        const requestForWebPageContent = await (0, request_promise_1.default)({ uri: baseURL, headers: { 'User-Agent': fakeUA } });
        const $ = cheerio_1.default.load(requestForWebPageContent);
        $('table.cmc-table tbody').find('tr').each((index, eachTR) => {
            const eachSymbol = $(eachTR).find('p.coin-item-symbol').first();
            const theFourthTD = $(eachTR).children('td')[3];
            const price = $(theFourthTD).find('a.cmc-link').first().html() || null;
            if (eachSymbol.html() === symbol && price != null) {
                resolve(price);
            }
        });
        reject('Cannot find any ticker matches the symbol or price is empty');
    });
}
exports.default = getPrice;
//# sourceMappingURL=get_price_by_symbol.js.map