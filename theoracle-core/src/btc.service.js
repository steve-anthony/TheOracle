//const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const MongoService = require('./mongo.service');
const usetube = require('usetube');
const fetch = require('node-fetch');
let mongoService = MongoService.getInstance();
var HTMLParser = require('node-html-parser');
const cloudflareScraper = require('cloudflare-scraper');
var userAgent = require('user-agents');

const randomUseragent = require('random-useragent');

//Enable stealth mode
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

module.exports = class BTCService {

	instance = null;

	static getInstance() {
		if (this.instance == null) {
			this.instance = new BTCService();
		}
		return this.instance;
	}

	constructor() {

	}

	async createReport(dataBTC, price) {

		let today = new Date();

		let bigWhales = 0;
		let whales = 0;
		let dolpins = 0;
		let others = 0;

		console.log(today.toISOString() + ' - count whales');
		for (let data of dataBTC) {

			if (data.range == '10000->100000' || data.range == '100000->0') {
				bigWhales += Number(data.amount);
			}
			if (data.range == '100->1000' || data.range == '1000->10000') {
				whales += Number(data.amount);
			}
			if (data.range == '1->10' || data.range == '10->100') {
				dolpins += Number(data.amount);
			}
			if (data.range == '1e-8->0.001' || data.range == '0.001->0.01' || data.range == '0.01->0.1' || data.range == '0.1->1') {
				others += Number(data.amount);
			}
		}

		console.log(today.toISOString() + ' - reporting');
		const report = {
			timestamp: new Date(),
			balances: {
				bigWhales: bigWhales,
				whales: whales,
				dolpins: dolpins,
				others: others
			},
			data: dataBTC,
			price: price
		};

		return report;

	}

	async retry(promiseFactory, retryCount) {
		try {
			return await promiseFactory();
		} catch (error) {
			if (retryCount <= 0) {
				throw error;
			}
			return await retry(promiseFactory, retryCount - 1);
		}
	}

	async getBalancesNEW() {

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

	async createPage(browser, url) {

		//Randomize User agent or Set a valid one
		const userAgent = randomUseragent.getRandom();
		const UA = userAgent || USER_AGENT;
		const page = await browser.newPage();

		//Randomize viewport size
		await page.setViewport({
			width: 1920 + Math.floor(Math.random() * 100),
			height: 3000 + Math.floor(Math.random() * 100),
			deviceScaleFactor: 1,
			hasTouch: false,
			isLandscape: false,
			isMobile: false,
		});

		//await page.cookies();
		await page.setUserAgent(UA);
		await page.setJavaScriptEnabled(true);
		await page.setDefaultNavigationTimeout(0);

		//Skip images/styles/fonts loading for performance
		await page.setRequestInterception(true);
		page.on('request', (req) => {
			if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
				req.abort();
			} else {
				req.continue();
			}
		});

		await page.evaluateOnNewDocument(() => {
			// Pass webdriver check
			Object.defineProperty(navigator, 'webdriver', {
				get: () => false,
			});
		});

		await page.evaluateOnNewDocument(() => {
			// Pass chrome check
			window.chrome = {
				runtime: {},
				// etc.
			};
		});

		await page.evaluateOnNewDocument(() => {
			//Pass notifications check
			const originalQuery = window.navigator.permissions.query;
			return window.navigator.permissions.query = (parameters) => (
				parameters.name === 'notifications' ?
					Promise.resolve({ state: Notification.permission }) :
					originalQuery(parameters)
			);
		});

		await page.evaluateOnNewDocument(() => {
			// Overwrite the `plugins` property to use a custom getter.
			Object.defineProperty(navigator, 'plugins', {
				// This just needs to have `length > 0` for the current test,
				// but we could mock the plugins too if necessary.
				get: () => [1, 2, 3, 4, 5],
			});
		});

		await page.evaluateOnNewDocument(() => {
			// Overwrite the `languages` property to use a custom getter.
			Object.defineProperty(navigator, 'languages', {
				get: () => ['en-US', 'en'],
			});
		});

		await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
		return page;
	}

	async getBalances() {

		let today = new Date();

		console.log(today.toISOString() + ' - fetch...');
		const res = await fetch("https://api.coinmarketcap.com/data-api/v3/crypto/holding-concentration?cryptoIds=1").then(res => res.json());
		console.log(today.toISOString() + " - feched");

		let arr = [];
		for (let i = 0; i < res.data.concentrations[0].distributions.length; i++) {
			let current = res.data.concentrations[0].distributions[i];
			current["range"] = current.from + "->" + current.to;
			arr.push(current);
		}

		return arr;

	}

	/**
	 * Scrap youtube to retreive comments under a youtube video
	 * @param {*} youtubeId 
	 * @returns 
	 */
	async getBalancesPUP() {

		//const fileContent = await fs.readFile('data/comments.json');

		//return JSON.parse(fileContent);

		const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
		/*const page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 800 });
		await page.cookies();
		await page.setUserAgent(userAgent.toString())*/

		const page = await this.createPage(browser, "https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html");
		//const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });

		// bypass cookies
		console.log("load BTC page...");

		/*await this.retry(
			() => Promise.all([
				page.goto("https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html"),
				page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
			]),
			1 // retry only once
		);*/

		//await page.waitFor(9000);
		console.log("get");
		let aaaa = await page.content();
		console.log(aaaa);

		console.log("waitForSelector");
		await page.waitForSelector('.table.table-condensed.bb tr td');

		//await navigationPromise;
		console.log("page load");

		// get comments
		//console.log("get balance...");
		//const balanceArr = await page.$$(".table.table-condensed.bb tr td",
		//	elements => elements.map(item => item.innerText));
		//console.log("innerText...");
		//await page.waitFor(2000);
		let collumName = {
			'0': 'range',
			'1': 'adressesCount',
			'2': 'adressesPercent',
			'3': 'coins',
			'4': 'usd',
			'5': 'coinsPercent',
		}

		console.log("loop");

		let resultArr = [];
		for (let j = 0; j < 10; j++) {
			let line = {};
			for (let i = 0; i < 6; i++) {

				//let balance = await (await balanceArr[(j * 6) + i].getProperty('innerText')).jsonValue();
				let index = (j * 6) + i;
				let balance = await page.evaluate((index) => {

					let element = document.querySelectorAll('.table.table-condensed.bb tr td')[index].innerText;
					return element;

				}, index);
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

		await browser.close();

		return resultArr;
	}

}
