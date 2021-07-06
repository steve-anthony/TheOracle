
const MongoService = require('./../theoracle-core/src/mongo.service');
const blacklist = require('./../theoracle-core/src/blacklist');
const fs = require('fs').promises;
var express = require('express');
const cors = require('cors');
var app = express();
let port = 3000;
let mongoService = new MongoService();

console.log();
console.log("---------------------------------------------");
console.log("THE ORACLE BACK");
console.log("---------------------------------------------");
console.log();

let mocked = false;
(async () => {

	var myArgs = process.argv.slice(2);

	if (myArgs.length == 0) {
		await mongoService.init();
	} else if (myArgs[0] == "mock") {
		console.log("Mongo is mocked");
		mocked = true;
	}

})();

app.use(cors());

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/reports', async function (req, res) {
	if (mocked) {
		console.log("MOCKED REPORT");
		let fileContent = await fs.readFile('data/reports.json');

		res.json(JSON.parse(fileContent));

	} else {

		let today = new Date();
		//today.setDate(today.getDate() - 1);
		today.setHours(0, 0, 0);

		let reports = await mongoService.findAndSort(MongoService.REPORT, {
			timestamp: {
				"$gte": today
			}
		}, { youtubeIndex: -1 }, {});

		reports = reports.filter(e => !(blacklist.indexOf(e.symbol) > -1));

		let sym = [];
		for (let i = 0; i < reports.length; i++) {
			sym.push(reports[i].symbol);
		}

		res.json(reports);
	}

});

app.get('/coin/:id', async function (req, res) {
	if (mocked) {
		console.log("MOCKED REPORT");
		let fileContent = await fs.readFile('data/coin.json');

		res.json(JSON.parse(fileContent));

	} else {
		var id = req.params.id;

		let reports = await mongoService.findAndSort(MongoService.REPORT, {
			symbol: id
		}, { timestamp: 1 }, {});

		console.log(reports.length);

		res.json(reports);
	}
});

app.get('/safemoon', async function (req, res) {
	if (mocked) {
		console.log("MOCKED REPORT");
		let fileContent = await fs.readFile('data/safemoon.json');

		res.json(JSON.parse(fileContent));

	} else {
		let reports = await mongoService.findAndSort(MongoService.SAFEMOON, {}, { timestamp: 1 }, {});

		console.log(reports.length);

		res.json(reports);
	}
});


app.get('/btc', async function (req, res) {
	if (mocked) {
		console.log("MOCKED REPORT");
		let fileContent = await fs.readFile('data/btc.json');

		res.json(JSON.parse(fileContent));

	} else {
		let reports = await mongoService.findAndSort(MongoService.BTC, {}, { timestamp: 1 }, {});

		console.log(reports.length);

		res.json(reports);
	}
});