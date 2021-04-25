
const YoutubeService = require('./src/youtube.service');
const MongoService = require('./src/mongo.service');
var cron = require('node-cron');
const CoreService = require('./src/core.service');
const TwitterService = require('./src/twitter.service');

let youtubeService = YoutubeService.getInstance();
let mongoService = MongoService.getInstance();
let coreService = CoreService.getInstance();
let twitterService = TwitterService.getInstance();

console.log();
console.log("---------------------------------------------");
console.log("THE ORACLE CORE");
console.log("---------------------------------------------");
console.log();

/**
 * This is the entry point of the app
 * @returns 
 */
async function main() {

	let today = new Date();
	console.log(today.toISOString() + ' - Starting...');
	//return;

	// connect to the base
	await mongoService.init();

	// fetch the coin list and update this in database
	const coins = await coreService.getCoins();

	// count how many time each crypto is quote in comments 
	const mapOccurenceByCoinsForYoutube = await youtubeService.computeMapOccurenceByCoins(coins);
	const mapOccurenceByCoinsForTwitter = await twitterService.computeMapOccurenceByCoins(coins);

	// create the report for each crypto
	const oracleIndexByCoins = await coreService.createReport(coins, {
		youtube: mapOccurenceByCoinsForYoutube,
		twitter: mapOccurenceByCoinsForTwitter
	});

	// save the report in base
	console.log(oracleIndexByCoins);
	for (let i = 0; i < oracleIndexByCoins.length; i++) {
		await mongoService.insert(MongoService.REPORT, oracleIndexByCoins[i]);
	}

	// end of the script
	console.log(today.toISOString() + " - This is the end");
	await mongoService.close();

	return;
}

/**
 * test if the connection with the base is ok
 * @returns 
 */
async function mongoTest() {
	let today = new Date();
	console.log(today.toISOString() + ' - Starting...');
	//return;

	await mongoService.init();

	console.log(today.toISOString() + ' - Connexion OK');
	return;
}

/**
 * Entry point with args
 * node main.js dev => app with cron (for prod)
 * node main.js dev => app without cron
 * node main.js mongo => test if db connexion work
 */
(async () => {

	var myArgs = process.argv.slice(2);

	if (myArgs.length == 0) {
		console.log('Start cron core.');
		cron.schedule('0 1 * * *', async () => {
			await main();
		});
	} else if (myArgs[0] == "dev") {
		await main();
	}
	else if (myArgs[0] == "mongo") {
		mongoTest();
	}

})()
