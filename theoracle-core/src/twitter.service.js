const request = require('request');
const util = require('util');
const requestPromise = util.promisify(request);

module.exports = class TwitterService {

	instance = null;

	static getInstance() {
		if (this.instance == null) {
			this.instance = new TwitterService();
		}
		return this.instance;
	}

	constructor() {

	}

	async searchTweet(words) {

		//3230545827-81YzxuZOkoIBCwOjZleab8tbYWe54wj5JV50A8w
		//1fvs2Prgoh7Ijus8GqNg4akvDNylEmUJK8p8gKOAotHXk
		const queryObject = { query: words, 'tweet.fields': 'author_id,created_at,entities,geo,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets,source' };

		let token = "AAAAAAAAAAAAAAAAAAAAAAlJtwAAAAAAJhLrh3Sg2YSpjtzcjYG9bozmPEU%3DKKP0H1xFp4kWClDsLLTmJ0ZLf1pVO0fPH6HtodTHnvkelFKjFg";
		const result = await requestPromise({
			url: 'https://api.twitter.com/2/tweets/search/recent',
			method: 'GET',
			qs: queryObject,
			auth: {
				bearer: token,
			}
		});

		return result;
	}

	/**
	 * Get the map of occurence for each coins
	 * @param {*} coins 
	 * @returns 
	 */
	async computeMapOccurenceByCoins(coins) {

		let a = await this.searchTweet("ada");
		console.log(a.body);

		return [];

	}

}
