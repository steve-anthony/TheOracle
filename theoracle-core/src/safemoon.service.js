const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const MongoService = require('./mongo.service');
const usetube = require('usetube');

let mongoService = MongoService.getInstance();

const fetch = require('node-fetch');
var HTMLParser = require('node-html-parser');

module.exports = class SafemoonService {

	instance = null;

	static getInstance() {
		if (this.instance == null) {
			this.instance = new SafemoonService();
		}
		return this.instance;
	}

	constructor() {

	}

	async createReport(balanceSafemoon, price) {

		console.log("price", price);

		console.log("createReport", balanceSafemoon);

		const safemoonReports = await mongoService.findAndSort(MongoService.SAFEMOON, {}, { timestamp: -1 });

		let preivousBalance = balanceSafemoon;
		if (safemoonReports.length > 0) {
			let lastSFR = safemoonReports[0];
			preivousBalance = safemoonReports[0].balance;
			console.log(lastSFR);
		}

		let burn = balanceSafemoon - preivousBalance;
		let burnP = burn / preivousBalance;

		let computedCurrentBalance = preivousBalance + (preivousBalance * burnP);

		console.log(balanceSafemoon + " - " + preivousBalance + " = " + burn);
		console.log(burn + " / " + preivousBalance + " = " + burnP);

		console.log("T1 = " + preivousBalance + " + " + burn + " = " + balanceSafemoon);
		console.log("T2 = " + preivousBalance + " + " + burn + " = " + (preivousBalance + burn));

		console.log("actual = " + balanceSafemoon);
		console.log("computed = " + computedCurrentBalance);
		console.log("diff = " + (balanceSafemoon - computedCurrentBalance));

		const safemoonReport = {
			timestamp: new Date(),
			balance: balanceSafemoon,
			burn: burn,
			burnP: burnP,
			price: price
		};

		console.log(safemoonReport);

		return safemoonReport;

	}

	async getSafemoonBiggestWhaleBalance() {

		console.log("fetch...");
		const res = await fetch("https://bscscan.com/token/0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3?a=0x0000000000000000000000000000000000000001").then(res => res.text());

		console.log("parse");
		let html = HTMLParser.parse(res);

		// get comments
		console.log("get balance html...");
		let balance = await html.querySelector('#ContentPlaceHolder1_divFilteredHolderBalance').innerText;
		console.log("raw", balance);

		console.log("trim...", balance);
		balance = balance.replace("BALANCE", "");
		balance = balance.replace("Balance", "");
		balance = balance.replace("SAFEMOON", "");
		balance = balance.replaceAll(",", "");
		balance = balance.trim();

		let balanceNumber = Number(balance);
		console.log("balance", balanceNumber);

		return balanceNumber;
	}

	/**
	 * Scrap youtube to retreive comments under a youtube video
	 * @param {*} youtubeId 
	 * @returns 
	 */
	async getSafemoonBiggestWhaleBalanceOLD() {

		//const fileContent = await fs.readFile('data/comments.json');

		//return JSON.parse(fileContent);

		const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
		const page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 800 });
		await page.cookies();
		//const navigationPromise = page.waitForNavigation();

		// bypass cookies
		console.log("load safemoon page...");
		await page.goto('https://bscscan.com/token/0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3?a=0x0000000000000000000000000000000000000001');

		await page.waitForSelector('#ContentPlaceHolder1_divFilteredHolderBalance', { timeout: 120000 });

		await page.waitFor(9000);
		console.log("page load");

		// get comments
		console.log("get balance...");
		const balanceArr = await page.$$("#ContentPlaceHolder1_divFilteredHolderBalance",
			elements => elements.map(item => item.innerText));
		console.log("innerText...");
		let balance = await (await balanceArr[0].getProperty('innerText')).jsonValue();

		console.log("trim...", balance);
		balance = balance.replace("BALANCE", "");
		balance = balance.replace("SAFEMOON", "");
		balance = balance.replaceAll(",", "");
		balance = balance.trim();

		let balanceNumber = Number(balance);
		console.log("balance", balanceNumber);

		await browser.close();

		return balanceNumber;
	}

}
