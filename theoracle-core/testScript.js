const fetch = require('node-fetch');
var HTMLParser = require('node-html-parser');
const cloudflareScraper = require('cloudflare-scraper');

async function getBalancesFETCH() {

    let resultArr = [];

    try {
        console.log("fetch...");
        const res = await cloudflareScraper.get('https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html');
        console.log(res);

        //const res = await fetch("https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html").then(res => res.text());
        console.log("feched");
        console.log(res);

        let html = HTMLParser.parse(res);

        let collumName = {
            '0': 'range',
            '1': 'adressesCount',
            '2': 'adressesPercent',
            '3': 'coins',
            '4': 'usd',
            '5': 'coinsPercent',
        }

        console.log("loop");

        for (let j = 0; j < 10; j++) {
            let line = {};
            for (let i = 0; i < 6; i++) {

                let index = (j * 6) + i;
                let balance = html.querySelectorAll('.table.table-condensed.bb tr td')[index].innerText;
                balance = balance.trim();
                line[collumName[i]] = balance;

                if (i > 0) {
                    let toClean = line[collumName[i]];
                    toClean = toClean.split(" ")[0];
                    toClean = toClean.replace("%", "");
                    toClean = toClean.replaceAll(",", "");
                    toClean = toClean.trim();
                    line[collumName[i]] = toClean;
                }
            }
            resultArr.push(line);

        }

        console.log(resultArr);

    } catch (error) {
        console.log("getBalancesFETCH : clouflare", error);
    }

    return resultArr;

}

(async () => {

    let balanceBTC = await getBalancesFETCH();
})()