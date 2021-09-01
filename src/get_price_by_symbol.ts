import cheerio from 'cheerio';
import request from 'request-promise';
// homepage shows latest ranking of popular coin directly, we use this to crawl htmls
const baseURL = 'https://coinmarketcap.com/';
const fakeUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36';

export default async function getPrice(symbol: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        const requestForWebPageContent = await request({ uri: baseURL, headers: { 'User-Agent': fakeUA } });
        const $ = cheerio.load(requestForWebPageContent);
        $('table.cmc-table tbody').find('tr').each((index, eachTR: cheerio.Element) => {
            const eachSymbol = $(eachTR).find('p.coin-item-symbol').first();
            const theFourthTD = $(eachTR).children('td')[3];
            const price: string | null = $(theFourthTD).find('a.cmc-link').first().html() || null;
            if (eachSymbol.html() === symbol && price != null) {
                resolve(price.replace('$', '').replace(',', ''));
            }
        });
        reject('Cannot find any ticker matches the symbol or price is empty');
    })
}