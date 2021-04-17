
var MongoClient = require('mongodb').MongoClient;

module.exports = class MongoService {

	url = "mongodb://localhost:27017";
	database;

	static COINS = "coins";
	static REPORT = "report";

	constructor() {

		if (process.env.MONGO_URL != null) {
			this.url = process.env.MONGO_URL;
		}

	}

	async init() {

		try {
			const client = await MongoClient.connect(this.url);
			this.database = client.db('oraclecrypto');
		} catch (err) {
			console.log(err);
		}

	}

	async find(collection, query) {

		return await this.database.collection(collection).find(query);
	}

	async findAndSort(collection, query, sortingQuery) {

		return await this.database.collection(collection).find(query).sort(sortingQuery).toArray();
	}

	async update(collection, where, toUp) {

		return await this.database.collection(collection).update(where, toUp);

	}

	async insert(collection, objToInsert) {

		this.database.collection(collection).insertOne(objToInsert, (err, res) => {
			if (err) throw err;
			//console.log("1 document inserted");
		});

	}

	async close() {
		this.database.close();
	}

}
