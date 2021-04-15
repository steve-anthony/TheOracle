const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const usetube = require('usetube');

module.exports = class YoutubeService {

	constructor() {

	}

	async searchFirstVideo(name) {

		let bitboy = await usetube.searchVideo(name);
		bitboy = bitboy.videos;

		if (bitboy != null && bitboy.length != -1) {
			return [bitboy[0]];
		}

		return [];
	}

	async  getYoutubeVideos() {

		//const fileContent = await fs.readFile('data/channels.json');

		//return JSON.parse(fileContent);

		var todayMinusFive = new Date();
		todayMinusFive.setDate(todayMinusFive.getDate() - 2);
		console.log(todayMinusFive);
		let videoArray = [];

		console.log("search best altcoin...");

		const bestArray = await usetube.searchVideo("best altcoin");
		console.log(bestArray);
		videoArray.push(...bestArray.videos.slice(0, 5));

		console.log(videoArray);

		console.log("search bitboy...");
		let ytChannel = await this.searchFirstVideo("BitBoy Crypto");
		videoArray.push(...ytChannel);

		console.log("search sheldon evans...");
		ytChannel = await this.searchFirstVideo("sheldon evans");
		videoArray.push(...ytChannel);

		console.log("search the moon...");
		ytChannel = await this.searchFirstVideo("the moon");
		videoArray.push(...ytChannel);

		// clean
		let alreadyAdded = {};
		let cleanVideoArray = [];
		for (let i = 0; i < videoArray.length; i++) {
			let current = videoArray[i];

			if (alreadyAdded[current.id] == null) {
				cleanVideoArray.push({
					id: current.id,
					title: current.title
				});
			}

			alreadyAdded[current.id] = true;
		}

		return cleanVideoArray;
	}

	async getYoutubeComments(youtubeId) {

		//const fileContent = await fs.readFile('data/comments.json');

		//return JSON.parse(fileContent);

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 800 });
		await page.cookies();
		const navigationPromise = page.waitForNavigation();

		// bypass cookies
		console.log("bypass cookies...");
		await page.goto('https://www.youtube.com/watch?v=' + youtubeId);
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Enter");

		await page.waitForSelector('#upsell-dialog-title');
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Enter");

		await page.waitForSelector('h1.title');

		await page.evaluate(_ => {
			window.scrollBy(0, window.innerHeight);
		});

		// scroll page to load comments
		console.log("scroll comments...");
		await page.waitFor(2000);
		await page.waitForSelector('#comments');
		await navigationPromise;

		await page.evaluate(_ => {
			window.scrollBy(0, document.body.scrollHeight);
		});
		await page.waitFor(2000);

		await page.waitForSelector('#comment:nth-child(1)');

		for (let i = 1; i < 10; i++) {
			await page.evaluate(_ => {
				scrollingElement = (document.scrollingElement || document.body);
				scrollingElement.scrollTop = scrollingElement.scrollHeight;
			});
			await page.waitFor(2000);
		}

		// get comments
		console.log("get comments...");
		const coms = await page.$$("#comments ytd-comment-renderer ytd-expander yt-formatted-string#content-text",
			elements => elements.map(item => item.innerText));

		const commentsArrays = [];
		for (let i = 0; i < coms.length; i++) {
			const tweet = await (await coms[i].getProperty('innerText')).jsonValue();
			commentsArrays.push(tweet);
		}

		await browser.close();

		return commentsArrays;
	}

	async  seaarchCoinInComments(comments, coins, mapOccurenceByCoins) {

		console.log("search");
		// get coin symbol
		let coinsSymbol = [];
		let coinsName = [];
		for (let i = 0; i < coins.length; i++) {
			let coin = coins[i];
			coinsSymbol.push(coin.symbol);
			coinsName.push(coin.name);
		}

		console.log(coinsSymbol);

		// get all words in comment cleaned
		let cleanWordsList = [];
		for (let i = 0; i < comments.length; i++) {
			let currentComment = comments[i];
			let wordsInComment = currentComment.split(" ");
			for (let j = 0; j < wordsInComment.length; j++) {
				let w = wordsInComment[j];
				cleanWordsList.push(w.toLowerCase());
			}

		}

		// search symbol

		for (let i = 0; i < cleanWordsList.length; i++) {
			let w = cleanWordsList[i];
			let validCoins = coinsSymbol.filter(e => ((w == e) || (w == "$" + e)));
			if (validCoins.length != 0) {

				for (let j = 0; j < validCoins.length; j++) {
					let coin = validCoins[j];
					if (mapOccurenceByCoins[coin] == null) {
						mapOccurenceByCoins[coin] = 1;
					} else {
						mapOccurenceByCoins[coin] += 1;
					}
				}

			}

		}
		return mapOccurenceByCoins;

	}

	async  getMapOccurenceByCoinsInYoutube(coins) {

		const youtubeSearch = await this.getYoutubeVideos();

		let allComments = [];
		for (let i = 0; i < youtubeSearch.length; i++) {
			let currentChannel = youtubeSearch[i];
			console.log("fetch commment for : " + currentChannel.title);
			const comms = await this.getYoutubeComments(currentChannel.id);
			allComments.push(...comms);
		}

		let mapOccurenceByCoins = {};
		await this.seaarchCoinInComments(allComments, coins, mapOccurenceByCoins);

		return mapOccurenceByCoins;

	}

}
