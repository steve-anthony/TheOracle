
const YoutubeService = require('./src/youtube.service');
const MongoService = require('./src/mongo.service');
var cron = require('node-cron');
var kill = require('tree-kill');
const CoreService = require('./src/core.service');
const TwitterService = require('./src/twitter.service');
const SafemoonService = require('./src/safemoon.service');
const BTCService = require('./src/btc.service');

let youtubeService = YoutubeService.getInstance();
let mongoService = MongoService.getInstance();
let coreService = CoreService.getInstance();
let twitterService = TwitterService.getInstance();
let safemoonService = SafemoonService.getInstance();
let bTCService = BTCService.getInstance();

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
	console.log(new Date().toISOString() + " > " + 'main Starting...');
	//return;

	// connect to the base
	await mongoService.init();

	// call safemoon
	await safemoon();

	// call btc
	await btc();

	// end of the script
	console.log(new Date().toISOString() + " > " + "main the end");
	await mongoService.close();

	return;

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

	await coreService.getCoins();

	console.log(today.toISOString() + ' - Connexion OK');

	await mongoService.close();
	return;
}

async function tests() {

	let today = new Date();
	console.log(today.toISOString() + ' - Starting...');
	//return;

	// connect to the base
	await mongoService.init();

	// fetch the coin list and update this in database
	//const coins = await coreService.getCoins();
	const coins = [];

	// count how many time each crypto is quote in comments 
	const mapOccurenceByCoinsForTwitter = await twitterService.computeMapOccurenceByCoins(coins);

	console.log(mapOccurenceByCoinsForTwitter);

	console.log(today.toISOString() + ' - Connexion OK');

	await mongoService.close();
	return;
}

async function safemoon() {

	console.log(new Date().toISOString() + " > " + 'Safemoon');

	let balanceSafemoon = await safemoonService.getSafemoonBiggestWhaleBalance();

	// fetch the coin list and update this in database
	const coins = await coreService.simpleGetCoins();
	let safemoonPrice = null;
	try {
		safemoonPrice = coins.filter(a => a.symbol == "safemoon")[0]["price"];
	} catch {
		console.log(new Date().toISOString() + " > " + "impossible to get safemoon price");
	}

	let reportSafemoon = await safemoonService.createReport(balanceSafemoon, safemoonPrice);

	await mongoService.insert(MongoService.SAFEMOON, reportSafemoon);

	return;
}

async function btc() {

	console.log(new Date().toISOString() + " > " + 'BTC');

	let balanceBTC = await bTCService.getBalances();

	// fetch the coin list and update this in database
	console.log(new Date().toISOString() + " > " + 'get coins from cmc');
	const coins = await coreService.simpleGetCoins();
	let btcPrice = null;
	try {
		btcPrice = coins.filter(a => a.symbol == "btc")[0]["price"];
	} catch {
		console.log("impossible to get btc price");
	}

	console.log(new Date().toISOString() + " > " + 'create report');
	let reportBTC = await bTCService.createReport(balanceBTC, btcPrice);

	await mongoService.insert(MongoService.BTC, reportBTC);

	return;
}

var mineProc = null;

var os = require('os');

async function mine(statut) {

	if (statut) {

		let k = await killMine();
		console.log(new Date().toISOString() + " > " + "kill = ", k);

		console.log(new Date().toISOString() + " > " + "type = '" + os.type() + "'");
		let mineApp = "./xmrig";
		if (os.type() == "Darwin") {
			mineApp = "node fakeMine.js"
		}

		mineProc = await require('child_process').exec(mineApp);

		console.log(new Date().toISOString() + " > " + "new process mine " + mineProc.pid);
		//mineProc.stdout.pipe(process.stdout);

	} else {
		let k = await killMine();
		console.log("kill = ", k);
	}
}

async function killMine() {

	if (mineProc) {

		return await new Promise(resolve => {

			console.log(new Date().toISOString() + " > " + "end process mine", mineProc.pid);
			mineProc.on("exit", async () => {
				console.log(new Date().toISOString() + " > " + "mine event exit");
				mineProc = null;
				resolve(true);
			});
			mineProc.on("error", async () => {
				console.log(new Date().toISOString() + " > " + "mine event error");
				mineProc = null;
				resolve(true);
			});

			//mineProc.kill('SIGTERM');
			//mineProc.kill('SIGKILL');
			kill(mineProc.pid);

			//mineProc.kill('SIGKILL');

		});

	} else {
		return false;
	}

}

/**
 * Entry point with args
 * node main.js => app with cron (for prod)
 * node main.js dev => app without cron
 * node main.js mongo => test if db connexion work
 */
(async () => {

	var myArgs = process.argv.slice(2);

	if (myArgs.length == 0) {
		console.log('Start cron core v2.');

		cron.schedule('0 0 * * *', async () => {
			console.log("-- stop the mining");
			await mine(false);
			console.log("-- main");
			await main();
			console.log("-- start the mining");
			await mine(true);
		});

		await mine(true);

	} else if (myArgs[0] == "dev") {
		await main();
	} else if (myArgs[0] == "tests") {
		await tests();
	} else if (myArgs[0] == "safemoon") {
		await mongoService.init();
		await safemoon();
		await mongoService.close();
	}
	else if (myArgs[0] == "mongo") {
		mongoTest();
	}
	else if (myArgs[0] == "mine") {
		console.log('Mine.');
		await mine(true);
		cron.schedule('* * * * *', async () => {
			console.log("-- stop the mining");
			await mine(false);
			console.log("-- do my stuff");
			let balanceBTC = await bTCService.getBalances();
			let report = await bTCService.createReport(balanceBTC, 0);
			let balanceSafemoon = await safemoonService.getSafemoonBiggestWhaleBalance();

			console.log("report", report);
			console.log("balanceSafemoon", balanceSafemoon);
			console.log("-- start the mining");
			await mine(true);
		});
	} else if (myArgs[0] == "btc") {
		console.log('BTC.');

		await mongoService.init();
		await btc();
		await mongoService.close();

	} else if (myArgs[0] == "custom") {
		console.log('custom.');

		let balanceBTC = await bTCService.getBalances();
		let report = await bTCService.createReport(balanceBTC, 0);
		let balanceSafemoon = await safemoonService.getSafemoonBiggestWhaleBalance();

		console.log("report", report);
		console.log("balanceSafemoon", balanceSafemoon);
	}

})()
