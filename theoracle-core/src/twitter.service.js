

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

	/**
	 * Get the map of occurence for each coins
	 * @param {*} coins 
	 * @returns 
	 */
	async computeMapOccurenceByCoins(coins) {

		return [];

	}

}
